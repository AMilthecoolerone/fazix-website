import { readDoc, updateDoc, newId } from '@/lib/store';
import { detectPlatform, type ClipPlatform } from '@/lib/clipUtils';

export { CLIP_CATEGORIES } from '@/lib/clipUtils';

export type ClipStatus = 'pending' | 'approved' | 'featured' | 'rejected';

export interface Clip {
  id: string;
  title: string;
  url: string;
  platform: ClipPlatform;
  category: string;
  description: string;
  submittedBy: { id: string; name: string; avatarUrl?: string };
  status: ClipStatus;
  reviewNote: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const KEY = 'clips';
export const CLIP_STATUSES: ClipStatus[] = ['pending', 'approved', 'featured', 'rejected'];

export async function listClips(): Promise<Clip[]> {
  return readDoc<Clip[]>(KEY, []);
}

export async function addClip(input: Omit<Clip, 'id' | 'status' | 'reviewNote' | 'createdAt' | 'updatedAt' | 'platform'>): Promise<Clip> {
  const now = new Date().toISOString();
  const clip: Clip = { ...input, platform: detectPlatform(input.url), id: newId('clip'), status: 'pending', reviewNote: '', createdAt: now, updatedAt: now };
  await updateDoc<Clip[], void>(KEY, [], (clips) => {
    clips.unshift(clip);
  });
  return clip;
}

export async function reviewClip(id: string, patch: { status?: ClipStatus; reviewNote?: string }, by: string): Promise<Clip | null> {
  return updateDoc<Clip[], Clip | null>(KEY, [], (clips) => {
    const clip = clips.find((c) => c.id === id);
    if (!clip) return null;
    if (patch.status && CLIP_STATUSES.includes(patch.status)) clip.status = patch.status;
    if (typeof patch.reviewNote === 'string') clip.reviewNote = patch.reviewNote.slice(0, 1000);
    clip.reviewedBy = by;
    clip.updatedAt = new Date().toISOString();
    return clip;
  });
}

export async function deleteClip(id: string, ownerId?: string): Promise<boolean> {
  return updateDoc<Clip[], boolean>(KEY, [], (clips) => {
    const i = clips.findIndex((c) => c.id === id && (!ownerId || c.submittedBy.id === ownerId));
    if (i === -1) return false;
    clips.splice(i, 1);
    return true;
  });
}
