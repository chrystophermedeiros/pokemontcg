import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import '../styles/modal.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ cardData, open, onClose }) {
  if (!cardData) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style} className="modal-container">
      <div
          onClick={onClose}
          className="modal-button-primary"
        >
          Fechar
        </div>
        <h1 id="modal-title" className="modal-title">{cardData.name}</h1>
       <div>
       {cardData.images?.large && (
          <img
            src={cardData.images.large}
            alt={cardData.name}
            className="modal-image"
          />
        )}
       </div>
        <p className="modal-text">
          <strong>Tipo:</strong> {cardData.types ? cardData.types.join(", ") : "N/A"}
        </p>
        <p className="modal-text">
          <strong>Raridade:</strong> {cardData.rarity || "N/A"}
        </p>
        <p className="modal-text">
          <strong>Regras:</strong> {cardData.rules || "N/A"}
        </p>
        <p className="modal-text">
          <strong>Evoluções:</strong> {cardData.evolvesTo || "N/A"}
        </p>

        {cardData.attacks && cardData.attacks.length > 0 && (
          <div className="modal-section">
            <h2 className="modal-subtitle">Ataques:</h2>
            {cardData.attacks.map((attack, index) => (
              <div key={index} className="modal-attack">
                <p><strong>{attack.name}</strong></p>
                <p><strong>Custo de energia:</strong> {attack.cost.join(", ")}</p>
                <p><strong>Dano:</strong> {attack.damage}</p>
                <p><strong>Efeito:</strong> {attack.text}</p>
              </div>
            ))}
          </div>
        )}

        {cardData.weaknesses && cardData.weaknesses.length > 0 && (
          <div className="modal-section">
            <h2 className="modal-subtitle">Fraquezas:</h2>
            {cardData.weaknesses.map((weakness, index) => (
              <div key={index} className="modal-weakness">
                <p><strong>Tipo:</strong> {weakness.type}</p>
                <p><strong>Valor:</strong> {weakness.value}</p>
              </div>
            ))}
          </div>
        )}

        {cardData.retreatCost && (
          <div className="modal-section">
            <p><strong>Custo de retirada:</strong> {cardData.retreatCost.join(", ")}</p>
          </div>
        )}

     

        <Button
          onClick={onClose}
          className="modal-button"
        >
          Fechar
        </Button>
      </Box>
    </Modal>
  );
}
