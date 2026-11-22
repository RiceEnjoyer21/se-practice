// The room catalog: data only, no rules. Fictional rooms and bookings.
// Times are minutes after midnight (600 = 10:00).

export type RoomBooking = { start: number; end: number; label: string };

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: RoomBooking[];
};

// Every equipment name the page offers as a filter.
export const EQUIPMENT: string[] = ['projector', 'whiteboard', 'computers', 'microphone', 'video-conference'];

export const ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Engineering 101',
    capacity: 40,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { start: 540, end: 600, label: 'CS 201 Lecture' },
      { start: 720, end: 780, label: 'Faculty Meeting' },
    ],
  },
  {
    id: 'r2',
    name: 'Science Lab A',
    capacity: 24,
    equipment: ['whiteboard', 'computers'],
    blocked: false,
    bookings: [{ start: 600, end: 660, label: 'Chemistry Lab' }],
  },
  {
    id: 'r3',
    name: 'Library Study Room',
    capacity: 8,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [
      { start: 840, end: 900, label: 'Book Club' },
      { start: 960, end: 1020, label: 'Research Group' },
    ],
  },
  {
    id: 'r4',
    name: 'Auditorium B',
    capacity: 120,
    equipment: ['projector', 'microphone'],
    blocked: true,
    bookings: [{ start: 600, end: 660, label: 'Maintenance' }],
  },
  {
    id: 'r5',
    name: 'Seminar Room C-12',
    capacity: 16,
    equipment: ['projector', 'whiteboard', 'video-conference'],
    blocked: false,
    bookings: [{ start: 600, end: 690, label: 'Thesis Defence Rehearsal' }],
  },
];
