import  { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from './Modal';
import { firebaseApp, getFirestore } from "../../firebase"; 
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc,getDoc } from 'firebase/firestore';
import EditModal from './EditModal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  desc: string;
  finished?: boolean;
}

function MainPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [finishedNotes, setFinishedNotes] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); 
  const [selectAll, setSelectAll] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [selectedNote, setSelectedNote] = useState<Note | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestNotes, setGuestNotes] = useState<Note[]>([]);

  const db = getFirestore(firebaseApp);
  const navigate = useNavigate(); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotes = async () => {
        const querySnapshot = await getDocs(collection(db, 'notes'));
        const fetchedNotes: Note[] = [];
        querySnapshot.forEach((doc) => {
          fetchedNotes.push(doc.data() as Note);
        });
        setNotes(fetchedNotes);
      };

      fetchNotes();
    } else {
      const savedGuestNotes = localStorage.getItem('guestNotes');
      if (savedGuestNotes) {
        setGuestNotes(JSON.parse(savedGuestNotes));
      }
    }
  }, [db, isAuthenticated]);

  const handleSaveGuestNote = (note: { title: string; desc: string }) => {
    const newNote = { ...note, id: Date.now().toString(), finished: false }; 
    const updatedGuestNotes = [...guestNotes, newNote];
    setGuestNotes(updatedGuestNotes);
    localStorage.setItem('guestNotes', JSON.stringify(updatedGuestNotes));
  };
  

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setShowEditModal(true); 
  };

  const handleSaveEdit = async (updatedNote: { id: string; title: string; desc: string }) => {
    if (!updatedNote.id) {
      console.error('Note ID is missing');
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (isAuthenticated) {
        // For authenticated users, save the note to Firebase
        const noteRef = doc(db, 'notes', updatedNote.id);
        const docSnap = await getDoc(noteRef);
  
        if (!docSnap.exists()) {
          console.error('No such document!');
          return; // Early exit if the document doesn't exist
        }
  
        await updateDoc(noteRef, {
          title: updatedNote.title,
          desc: updatedNote.desc,
        });
  
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          )
        );
      } else {

        const updatedGuestNotes = guestNotes.map((note) =>
          note.id === updatedNote.id ? { ...note, title: updatedNote.title, desc: updatedNote.desc } : note
        );
  
        setGuestNotes(updatedGuestNotes);
        localStorage.setItem('guestNotes', JSON.stringify(updatedGuestNotes));
      }
  
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating note: ', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const handleDeleteNotes = async () => {
    if (isAuthenticated) {
        setIsLoading(true); 
        try {
            for (const index of selectedNotes) {
                const noteToDelete = notes[index];
                if (noteToDelete && noteToDelete.id) {
                    const noteRef = doc(db, 'notes', noteToDelete.id);
                    await deleteDoc(noteRef);
                }
            }
            setNotes((prevNotes) =>
                prevNotes.filter((_, index) => !selectedNotes.includes(index))
            );
            setSelectedNotes([]);
            setFinishedNotes((prev) => prev.filter((index) => !selectedNotes.includes(index))); 
        } catch (error) {
            console.error("Error deleting note: ", error);
        } finally {
            setIsLoading(false);
        }
    } else {
        const updatedGuestNotes = guestNotes.filter((_, index) => !selectedNotes.includes(index));
        setGuestNotes(updatedGuestNotes);
        localStorage.setItem('guestNotes', JSON.stringify(updatedGuestNotes));
        setSelectedNotes([]);
    }
};


  const handleSelectNote = (index: number) => {
    setSelectedNotes((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleFinishNotes = () => {
    if (isAuthenticated) {
      const updatedNotes = [...notes];
      selectedNotes.forEach((index) => {
        updatedNotes[index].finished = true; 
      });
      setNotes(updatedNotes);
  
      // Update finishedNotes to include the selected notes' indexes
      const updatedFinishedNotes = [...finishedNotes, ...selectedNotes];
      setFinishedNotes(updatedFinishedNotes);
    } else {
      const updatedGuestNotes = [...guestNotes];
      selectedNotes.forEach((index) => {
        updatedGuestNotes[index].finished = true;
      });
      setGuestNotes(updatedGuestNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedGuestNotes));
  
      // Update finishedNotes for guest notes
      const updatedFinishedNotes = [...finishedNotes, ...selectedNotes];
      setFinishedNotes(updatedFinishedNotes);
    }
  
    setSelectedNotes([]); 
  };
  

  
  

const handleSelectAll = () => {
  if (isAuthenticated) {
      if (selectAll) {
          setSelectedNotes([]);
      } else {
          setSelectedNotes(notes.map((_, index) => index));
      }
      setSelectAll(!selectAll);
  } else {
      if (selectAll) {
          setSelectedNotes([]);
      } else {
          setSelectedNotes(guestNotes.map((_, index) => index)); 
      }
      setSelectAll(!selectAll);
  }
};

  const handleMakeNote = async (note: { title: string; desc: string }) => {
    if (isAuthenticated) {

      setIsLoading(true);
      try {
        const docRef = await addDoc(collection(db, 'notes'), note);
        const newNote = { ...note, id: docRef.id };
        setNotes((prevNotes) => [...prevNotes, newNote]);
        setShowModal(false);
      } catch (error) {
        console.error('Error adding note: ', error);
      } finally {
        setIsLoading(false); 
      }
    } else {
      handleSaveGuestNote(note);
      setShowModal(false);
    }
  };

  const handleEditNoteFromDropdown = () => {
    if (selectedNotes.length === 1) {
        const noteToEdit = isAuthenticated
            ? notes[selectedNotes[0]]  // Firebase
            : guestNotes[selectedNotes[0]];  // Guest
        setSelectedNote(noteToEdit);  
        setShowEditModal(true);  
    } else {
        alert('Please select exactly one note to edit');
    }
};

  return (
    <>
      <div className="container d-flex flex-column min-vh-100">
        <div className="btn-group mb-3">
          <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
            Create
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleDeleteNotes}
            disabled={selectedNotes.length === 0 || isLoading}
          >
            Delete
          </button>
          <button
            className="btn btn-outline-success"
            onClick={handleFinishNotes}
            disabled={selectedNotes.length === 0}
          >
            Finish
          </button>

          <div className="dropdown">
            <button
              className="btn btn-outline-info dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              More
            </button>
            {showDropdown && (
              <div className="dropdown-menu show">
                <button className="dropdown-item" onClick={handleSelectAll}>
                  {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                <button className="dropdown-item" onClick={handleEditNoteFromDropdown}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="d-flex justify-content-center h-100">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="row">
          {isAuthenticated ? (
            notes.map((note, index) => (
<div key={note.id} className={`col-md-3 ` }>
  <div className={`card shadow-sm  `}>
    <div className={`card-body  ${finishedNotes.includes(index) ? 'bg-success text-white' : ''}`}>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedNotes.includes(index)}
          onChange={() => handleSelectNote(index)}
        />
      </div>
      <h5 className="card-title">{note.title}</h5>
      <p className="card-text">{note.desc}</p>
      <button onClick={() => handleEditNote(note)} className="btn btn-outline-info">Edit</button>
    </div>
  </div>
</div>
            ))
          ) : (
            guestNotes.map((note, index) => (
              <div key={note.id} className="col-md-3 mb-3">
                <div className={`card shadow-sm `}>
                  <div className={`card-body  ${finishedNotes.includes(index) ? 'bg-success text-white' : ''}`}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedNotes.includes(index)}
                        onChange={() => handleSelectNote(index)}
                      />
                    </div>
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.desc}</p>
                    <button onClick={() => handleEditNote(note)} className="btn btn-outline-info">Edit</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)} saveData={handleMakeNote} />
        
        {showEditModal && selectedNote && (
  <EditModal 
    note={selectedNote} 
    onSave={handleSaveEdit} 
    onClose={() => setShowEditModal(false)} 
  />
)}

      </div>
    </>
  );
}

export default MainPage;
