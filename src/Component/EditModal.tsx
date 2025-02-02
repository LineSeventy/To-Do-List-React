import  { useState } from 'react';

interface EditModalProps {
    note: { title: string; desc: string; id: string }; // Include 'id' in the note prop type
    onSave: (updatedNote: { id: string; title: string; desc: string }) => void; // Include 'id' in the onSave type
    onClose: () => void;
  }
  function EditModal({ note, onSave, onClose }: EditModalProps) {
    const [title, setTitle] = useState(note.title);
    const [desc, setDesc] = useState(note.desc);
  
    const handleSave = () => {
        if (!note.id) {
          console.error("Note ID is missing when trying to save changes");
          return;
        }
        onSave({ id: note.id, title, desc }); // Include the id when saving
      };
      
  
    return (
      <div className="modal show" tabIndex={-1} style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Note</h5>
              <button type="button" className="btn btn-close" onClick={onClose}>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="editTitle">Title</label>
                <input
                  id="editTitle"
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group mt-2">
                <label htmlFor="editDesc">Description</label>
                <textarea
                  id="editDesc"
                  className="form-control"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default EditModal;
