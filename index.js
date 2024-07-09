class Booking {
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: Room;

  constructor(name: string, email: string, checkIn: string, checkOut: string, discount: number, room: Room) {
    this.name = name;
    this.email = email;
    this.checkIn = new Date(checkIn);
    this.checkOut = new Date(checkOut);
    this.discount = discount;
    this.room = room;
  }

  get fee(): number {
    const days = (this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60 * 24);
    const roomRate = this.room.rate * (1 - this.room.discount / 100);
    const bookingDiscount = this.discount / 100;
    return days * roomRate * (1 - bookingDiscount);
  }
}

class Room {
  name: string;
  bookings: Booking[];
  rate: number;
  discount: number;

  constructor(name: string, rate: number, discount: number) {
    this.name = name;
    this.bookings = [];
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date: string | Date): boolean {
    const checkDate = new Date(date);
    return this.bookings.some(
      booking => checkDate >= booking.checkIn && checkDate <= booking.checkOut
    );
  }

  occupancyPercentage(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let occupiedDays = 0;

    for (let d = 0; d < totalDays; d++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + d);
      if (this.isOccupied(currentDate)) {
        occupiedDays++;
      }
    }

    const occupancyPercentage = (occupiedDays / totalDays) * 100;

    return Math.round(occupancyPercentage * 100) / 100;
  }

  static totalOccupancyPercentage(rooms: Room[], startDate: string | Date, endDate: string | Date): number {
    const totalRooms = rooms.length;

    const occupancySum = rooms.reduce(
      (sum, room) => sum + room.occupancyPercentage(startDate, endDate),
      0
    );

    const averageOccupancyPercentage = occupancySum / totalRooms;

    return Math.round(averageOccupancyPercentage * 100) / 100;
  }

  static availableRooms(rooms: Room[], startDate: string | Date, endDate: string | Date): Room[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return rooms.filter(room => {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        if (room.isOccupied(currentDate)) {
          return false; 
        }
      }
      return true;
    });
  }
}

export { Booking, Room };
