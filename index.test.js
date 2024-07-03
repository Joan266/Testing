const { Booking, Room } = require('./index.js');

describe('Room class', () => {
  test('isOccupied returns true if the room is occupied on the given date', () => {
    const room = new Room('Room 1', 10000, 10);
    const booking = new Booking('John Doe', 'john@example.com', '2024-07-01', '2024-07-05', 0, room);
    room.bookings.push(booking);

    expect(room.isOccupied('2024-07-02')).toBe(true);
    expect(room.isOccupied('2024-07-06')).toBe(false);
  });

  test('occupancyPercentage returns the correct percentage of days occupied', () => {
    const room = new Room('Room 1', 10000, 10);
    const booking1 = new Booking('John Doe', 'john@example.com', '2024-07-01', '2024-07-05', 0, room);
    const booking2 = new Booking('Jane Smith', 'jane@example.com', '2024-07-10', '2024-07-15', 0, room);
    room.bookings.push(booking1, booking2);

    expect(room.occupancyPercentage('2024-07-02', '2024-07-15')).toBeCloseTo(71.43, 2);
  });

  test('totalOccupancyPercentage returns the correct percentage for all rooms', () => {
    const room1 = new Room('Room 1', 10000, 10);
    const room2 = new Room('Room 2', 10000, 10);
    const booking1 = new Booking('John Doe', 'john@example.com', '2024-07-01', '2024-07-05', 0, room1);
    const booking2 = new Booking('Jane Smith', 'jane@example.com', '2024-07-10', '2024-07-15', 0, room2);
    room1.bookings.push(booking1);
    room2.bookings.push(booking2);

    expect(Room.totalOccupancyPercentage([room1, room2], '2024-07-01', '2024-07-15')).toBeCloseTo(36.67, 2);
  });

  test('availableRooms returns rooms that are not occupied for the entire duration', () => {
    const room1 = new Room('Room 1', 10000, 10);
    const room2 = new Room('Room 2', 10000, 10);
    const booking1 = new Booking('John Doe', 'john@example.com', '2024-07-01', '2024-07-05', 0, room1);
    room1.bookings.push(booking1);

    const availableRooms = Room.availableRooms([room1, room2], '2024-07-01', '2024-07-03');
    expect(availableRooms).toContain(room2);
    expect(availableRooms).not.toContain(room1);
  });
});

describe('Booking class', () => {
  test('fee returns the correct fee including discounts', () => {
    const room = new Room('Room 1', 10000, 10);
    const booking = new Booking('John Doe', 'john@example.com', '2024-07-01', '2024-07-05', 20, room);

    const expectedFee = (4 * (10000 * 0.9) * 0.8);
    expect(booking.fee).toBeCloseTo(expectedFee, 2);
  });
});
