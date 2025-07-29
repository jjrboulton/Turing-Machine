const { createApp } = Vue;

createApp({
    data() {
    return {
        tape: Array(11).fill(""),
        head: 5,
        currentState: "q0",
        table: [
        { state: "q0", read: "0", write: "1", move: "R", next: "q0" },
        { state: "q0", read: "1", write: "0", move: "R", next: "q0" },
        { state: "q0", read: "_", write: "_", move: "R", next: "halt" }
        ],
        running: false,
        stepCount: 0
    };
    },
    methods: {
    expandLeft() {
        this.tape.unshift("");
        this.head++;
    },
    expandRight() {
        this.tape.push("");
    },
    toggleCell(i) {
        if (this.tape[i] === "") this.tape[i] = "0";
        else if (this.tape[i] === "0") this.tape[i] = "1";
        else this.tape[i] = "";
    },
    addRow() {
        this.table.push({ state: "", read: "", write: "", move: "R", next: "" });
    },
    removeRow(i) {
        this.table.splice(i, 1);
    },
    step() {
        const symbol = this.tape[this.head] || "_";
        const match = this.table.find(
        r => r.state === this.currentState && r.read === symbol
        );
        if (!match) {
        alert("No matching rule found. Halting.");
        return;
        }

        // Write
        this.tape[this.head] = match.write === "_" ? "" : match.write;

        // Move
        if (match.move === "L") {
        if (this.head === 0) {
            this.expandLeft();
        } else {
            this.head--;
        }
        } else if (match.move === "R") {
        this.head++;
        if (this.head >= this.tape.length) this.expandRight();
        }

        // Update state
        this.currentState = match.next;
        // Incremement step count
        this.stepCount++;
    },
    run() {
        if (this.running) return;
        this.running = true;

        const stepDelay = 500; // ms
        const runStep = () => {
        if (!this.running || this.currentState === "halt") {
            this.running = false;
            return;
        }
        this.step();
        setTimeout(runStep, stepDelay);
        };

        runStep();
    },
    reset() {
        this.tape = Array(11).fill("");
        this.head = 5;
        this.currentState = "q0";
        this.running = false;
        this.stepCount = 0;
    }
    }
}).mount("#app");