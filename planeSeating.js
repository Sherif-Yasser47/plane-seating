class Block {
    constructor(cols, rows) {
        this.seats = [];
        this.cols = cols;
        this.rows = rows;
    };
    createSeats(blockNo) {
        for (let i = 1; i <= this.rows; i++) {
            for (let j = 1; j <= this.cols; j++) {
                this.seats.push({blockNo, row: i, col: j, type: null, passengerNo: null });
            };
        };
    };
};

class Plane {
    constructor(input, passengers) {
        this.blocks = [];
        this.input = input;
        this.passengers = passengers;
        this.plane = [];
    };

    //Creating a Block instnace for each block of seats according to the number of rows & cols in each block.
    createBlocks() {
        for (let i = 0; i < this.input.length; i++) {
            this.blocks.push(new Block(this.input[i][0], this.input[i][1]));
        }
        
        //Creating seats within each block, and identifying the block no for each seat.
        let blockNoIncrement = 1;
        this.blocks.forEach((block) => {
            block.createSeats(blockNoIncrement);
            blockNoIncrement++;
        })
    }

    defineSeatsTypes() {

        //Define Window Seats within blocks.
        this.blocks[0].seats.forEach(seat => {
            if (seat.col == 1) seat.type = 'window';
        });

        let lastBlock = this.blocks[this.blocks.length - 1];
        lastBlock.seats.forEach(seat => {
            if (seat.col == lastBlock.cols) seat.type = 'window';
        });

        //Define Aisle & Center seats within blocks.
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].seats.forEach((seat) => {
                if ((seat.type == null && seat.col == this.blocks[i].cols) || (seat.type == null && seat.col == 1)) {
                    seat.type = 'aisle'
                } else if (seat.type == null) {
                    seat.type = 'center'
                }
            });
        };
    };

    assignSeats() {
        let passenger = 1;

        //Joining all blocks' seats into one array of objects of Plane Seats.
        //Sorting seats from all Blocks (from left to right & from front to back).
        this.blocks.forEach((block) => {
            this.plane.push(...block.seats);
        })
        this.plane.sort((a, b) => a.row - b.row);        
        
        //First Assign Aisle Seats.
        this.plane.forEach((seat) => {
            if(passenger<= this.passengers && seat.type == 'aisle' && seat.passengerNo == null) {
                seat.passengerNo = passenger;
                passenger++;
            }
        })

        //Then Assign Window Seats.
        this.plane.forEach((seat) => {
            if(passenger<= this.passengers && seat.type == 'window' && seat.passengerNo == null) {
                seat.passengerNo = passenger;
                passenger++;
            }
        });

        //Then Assign Center Seats.
        this.plane.forEach((seat) => {
            if(passenger<= this.passengers && seat.type == 'center' && seat.passengerNo == null) {
                seat.passengerNo = passenger;
                passenger++;
            }
        })
    }
};



const assignPlane = (twoDArray, passengers) => {
    let pl = new Plane(twoDArray, passengers);
    pl.createBlocks();
    pl.defineSeatsTypes();
    pl.assignSeats();
    return pl.plane;
};

const input = [[3, 2], [4, 3], [2, 3], [3, 4]];


// The output will be an array of objects representing all the plane seats from right to left
// and from front to back, with all Passengers assigned to seats according to the rules.

console.log(assignPlane(input, 30));

