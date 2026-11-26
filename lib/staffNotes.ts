import { readDoc, updateDoc, newId } from '@/lib/store';

export interface StaffNote {
  id: string;
  text: string;
  author: { id: string; name: string; avatarUrl?: string };
  pinned: boolean;
  createdAt: string;
}

const KEY = 'staff-notes';
const MAX_NOTES = 200;

export async function listNotes(): Promise<StaffNote[]> {
  const notes = await readDoc<StaffNote[]>(KEY, []);
  return notes.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt));
}

export async function addNote(text: string, author: StaffNote['author']): Promise<StaffNote> {
  const note: StaffNote = { id: newId('note'), text, author, pinned: false, createdAt: new Date().toISOString() };
  await updateDoc<StaffNote[], void>(KEY, [], (notes) => {
    notes.unshift(note);
    notes.splice(MAX_NOTES);
  });
  return note;
}

export async function setPinned(id: string, pinned: boolean): Promise<StaffNote | null> {
  return updateDoc<StaffNote[], StaffNote | null>(KEY, [], (notes) => {
    const n = notes.find((x) => x.id === id);
    if (!n) return null;
    n.pinned = pinned;
    return n;
  });
}

export async function deleteNote(id: string): Promise<boolean> {
  return updateDoc<StaffNote[], boolean>(KEY, [], (notes) => {
    const i = notes.findIndex((x) => x.id === id);
    if (i === -1) return false;
    notes.splice(i, 1);
    return true;
  });
}
