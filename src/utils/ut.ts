export const saveNotes = (notes: any[]) => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };
  
  export const loadNotes = (): any[] => {
    const data = localStorage.getItem("notes");
    return data ? JSON.parse(data) : [];
  };
  