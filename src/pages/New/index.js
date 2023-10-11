
import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

import { useParams, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import './new.css';

const listRef = collection(db, "customers");

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0)

  const [complemento, setComplemento] = useState('')
  const [assunto, setAssunto] = useState('')
  const [status, setStatus] = useState('Aberto')
  const [idCustomer, setIdCustomer] = useState(false)


  useEffect(() => {
    async function loadCustomers() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })

          if (snapshot.docs.size === 0) {
            console.log("NENHUMA EMPRESA ENCONTRADA");
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
            setLoadCustomer(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomer(false);

          if (id) {
            loadId(lista);
          }

        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error)
          setLoadCustomer(false);
          setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
        })
    }

    loadCustomers();
  }, [id])


  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento);


        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomerSelected(index);
        setIdCustomer(true);

      })
      .catch((error) => {
        console.log(error);
        setIdCustomer(false);
      })
  }


  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  function hnadleChangeCustomer(e) {
    setCustomerSelected(e.target.value)
    console.log(customers[e.target.value].nomeFantasia);
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      //Atualizando chamado
      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso!")
          setCustomerSelected(0);
          setComplemento('');
          navigate('/dashboard')
        })
        .catch((error) => {
          toast.error("Ops erro ao atualizar esse chamado!")
          console.log(error);
        })

      return;
    }


    //Registrar um chamado
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado registrado!")
        setComplemento('')
        setCustomerSelected(0)
      })
      .catch((error) => {
        toast.error("Ops erro ao registrar, tente mais tarde!")
        console.log(error);
      })
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={id ? "Editando Nota" : "Nova Nota"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>

            

          <label>Nome da Nota</label>
            <input
              type="text"
            
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
            


            <textarea
              type="text"
              placeholder="Escreva sua nota."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Registrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}