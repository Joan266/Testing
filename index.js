class Booking {
  constructor(name, email, checkIn, checkOut, discount, room) {
    this.name = name;
    this.email = email;
    this.checkIn = new Date(checkIn);
    this.checkOut = new Date(checkOut);
    this.discount = discount;
    this.room = room;
  }

  get fee() {
    const days = (this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24);
    const roomRate = this.room.rate * (1 - this.room.discount / 100);
    const bookingDiscount = this.discount / 100;
    return days * roomRate * (1 - bookingDiscount);
  }
}

class Room {
  constructor(name, rate, discount) {
    this.name = name;
    this.bookings = [];
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date) {
    const checkDate = new Date(date);
    return this.bookings.some(
      booking => checkDate >= booking.checkIn && checkDate < booking.checkOut
    );
  }

  occupancyPercentage(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
    let occupiedDays = 0;
  
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (this.isOccupied(new Date(d))) occupiedDays++;
    }
  
    return (occupiedDays / totalDays) * 100;
  }
  
  static totalOccupancyPercentage(rooms, startDate, endDate) {
    const totalRooms = rooms.length;
    const occupancySum = rooms.reduce(
      (sum, room) => sum + room.occupancyPercentage(startDate, endDate),
      0
    );
    return occupancySum / totalRooms;
  }

  static availableRooms(rooms, startDate, endDate) {
    return rooms.filter(room => {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (room.isOccupied(d)) {
          return false; 
        }
      }
      return true; 
    });
  }
  
}

module.exports = { Booking, Room };
