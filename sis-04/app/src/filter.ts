import type { Room } from './rooms';

export type RoomCriteria = { attendees: number; equipment: string[] };

// F1: capacity >= attendees. F2: the room has ALL selected items (every, not some).
// Returns a new array; the rooms and the criteria are not changed.
// Blocked rooms are kept here: the page labels them, and checkRoom never reports them available (F3).
export function filterRooms<R extends Pick<Room, 'capacity' | 'equipment'>>(
  rooms: R[],
  criteria: RoomCriteria,
): R[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every((item) => room.equipment.includes(item)),
  );
}
