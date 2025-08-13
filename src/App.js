import { useState } from "react"; // Import React's state management hook

function Square({ value, onSquareClick }) {
  // Component for a single square, receives value to display and click handler
  return (
    <button className="square" onClick={onSquareClick}>
      {" "}
      {/* Render clickable button with CSS class */}
      <span className={value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : ''}>
        {value} {/* Display X, O, or nothing inside the button */}
      </span>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // Board component receives current player, board state, and play handler
  function handleClick(i) {
    // Function to handle clicks on specific squares
    if (squares[i] || calculateWinner(squares)) {
      
      return;
    }
    const nextSquares = squares.slice(); // Create a copy of the current board state
    if (xIsNext) {
      // If it's X's turn
      nextSquares[i] = "X"; // Place X in the clicked square
    } else {
      // If it's O's turn
      nextSquares[i] = "O"; // Place O in the clicked square
    }
    onPlay(nextSquares); // Pass the new board state back to Game component
  }
  const winner = calculateWinner(squares); // Check if there's a winner
  let move; 
  if (winner) {
    // If there's a winner
    move = "Winner: " + winner; // Display winner message
  } else {
    // If no winner yet
    move = (xIsNext ? "X" : "O") + "'s turn to move"; // Display whose turn it is
  }//
  return (
    <>
      {" "}
      {/* React fragment to return multiple elements */}
      <div className="status">{move}</div>{" "}
      {/* Display game status (winner or next player) */}
      <div className="board-row">
        {" "}
        {/* First row of the tic-tac-toe board */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />{" "}
        {/* Top-left square */}
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />{" "}
        {/* Top-center square */}
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />{" "}
        {/* Top-right square */}
      </div>
      <div className="board-row">
        {" "}
        {/* Second row of the tic-tac-toe board */}
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />{" "}
        {/* Middle-left square */}
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />{" "}
        {/* Center square */}
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />{" "}
        {/* Middle-right square */}
      </div>
      <div className="board-row">
        {" "}
        {/* Third row of the tic-tac-toe board */}
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />{" "}
        {/* Bottom-left square */}
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />{" "}
        {/* Bottom-center square */}
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />{" "}
        {/* Bottom-right square */}
      </div>
    </>
  );
}

export default function Game() {
  // Main game component that manages all state and history
  const [xIsNext, setXIsNext] = useState(true); // Track whose turn it is (true = X's turn, false = O's turn)
  const [history, setHistory] = useState([Array(9).fill(null)]); // Array of game states, starts with empty board
  const [currentMove, setCurrentMove] = useState(0); // Which move in history we're currently viewing
  const currentSquares = history[currentMove]; // Get the board state for the current move

  function handlePlay(nextSquares) {
    // Function called when a move is made
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // Create new history up to current move + new move
    setHistory(nextHistory); // Update the history array
    setCurrentMove(nextHistory.length - 1); // Set current move to the latest move
    setXIsNext(!xIsNext); // Toggle whose turn it is
  }

  function jumpTo(nextMove) {
    // Function to jump to a specific move in history
    setCurrentMove(nextMove); // Set which move we're viewing
    setXIsNext(nextMove % 2 === 0); // Calculate whose turn it should be (even moves = X's turn)
  }

  function resetGame() {
    // Function to reset the game to initial state
    setHistory([Array(9).fill(null)]); // Reset history to empty board
    setCurrentMove(0); // Reset to first move
    setXIsNext(true); // Reset to X's turn
  }

  const moves = history.map((squares, move) => {
    // Create a list of buttons for each move in history
    if (move === 0) {
      // Skip the first move (game start)
      return null;
    }
    const description = "Reset to move #" + move; // Button text with move number
    return (
      // Return a list item with a button
      <li key={move}>
        {" "}
        {/* List item with unique key */}
        <button onClick={() => jumpTo(move)}>{description}</button>{" "}
        {/* Button that jumps to specific move */}
      </li>
    );
  }).filter(Boolean); // Remove null entries

  return (
    <div className="game">
      {" "}
      {/* Main game container */}
      <h1 className="game-title">Tic-Tac-Toe</h1> {/* Cool game title heading */}
      <div className="game-board">
        {" "}
        {/* Container for the tic-tac-toe board */}
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />{" "}
        {/* Render the game board */}
      </div>
      <div className="game-info">
        {" "}
        {/* Container for game history and controls */}
        <button className="reset-button" onClick={resetGame}>Reset Game</button> {/* Reset button to clear board and history */}
        {history.length > 1 && ( /* Only show move history if moves have been made */
          <>
            <h3>Move History</h3> {/* Heading for the move history section */}
            <ul>{moves}</ul> {/* Unordered list of move history buttons (no numbers) */}
          </>
        )}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // Function to determine if there's a winner
  const lines = [
    // Array of all possible winning combinations (3 in a row)
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];
  for (let i = 0; i < lines.length; i++) {
    // Loop through each winning combination
    const [a, b, c] = lines[i]; // Destructure the three positions in current line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Check if all three positions have same non-null value
      return squares[a]; // Return the winner (X or O)
    }
  }
  return null; // No winner found, return null
}
