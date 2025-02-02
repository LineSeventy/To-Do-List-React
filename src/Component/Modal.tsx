import  { useState, useEffect } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  saveData: (note: { title: string; desc: string }) => void;
}

function Modal({ show, onClose, saveData }: ModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // Reset title and desc when modal is closed
  useEffect(() => {
    if (!show) {
      setTitle("");
      setDesc("");
    }
  }, [show]);

  const handleSave = () => {
    const note = { title, desc };
    saveData(note);
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog d-flex justify-content-center align-items-center h-100">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Note</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="titleUser"
                  value={title} // Add value prop to bind the input to state
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="titleUser">Title:</label>
              </div>
              <div className="form-floating">
                <textarea
                  name=""
                  className="form-control"
                  id="desc"
                  style={{ height: "100px" }}
                  value={desc} // Add value prop to bind the textarea to state
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label htmlFor="desc">Description:</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Create Note</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
