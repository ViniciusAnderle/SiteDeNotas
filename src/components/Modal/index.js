
import { FiX } from 'react-icons/fi'
import './modal.css';

export default function Modal({ conteudo, close }){
  return(
    <div className="modal">
      <div className="container">
        <button className="close" onClick={ close }>
          <FiX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Nota</h2>

          <div className="row">
            <span>
              Nome da nota: <i>{conteudo.assunto}</i>
            </span>
          </div>

         
          {conteudo.complemento !== '' && (
          <>
            <h3>Sua Nota:</h3>
            <p>
              {conteudo.complemento}
            </p>
          </>
          )}

        </main>
      </div>
    </div>
  )
}