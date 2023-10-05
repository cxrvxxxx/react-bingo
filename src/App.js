import React, { useState, useEffect, useRef }  from 'react';
import './App.css';
import axios from 'axios';
import { Button } from '@mui/material';

/* REST Calls for Bingo

BINGO Url GameBoard: http://www.hyeumine.com/bingodashboard.php?bcode=HEelhJos
HEelhJos is the GameCode

Get Card URL: http://www.hyeumine.com/getcard.php?bcode=HEelhJos
Parameter: bcode = Bingo Game Code
Return: 0 if Game Code not Found
JSON Encoded shown below.

Check Card Win: http://www.hyeumine.com/checkwin.php?playcard_token=vxhwG7TPiAMqwxd2
Parameter: playcard_token= Playcard_token returned when asking requesting a Bingo Card.
Return: 0 if Playcard_token not Found, Or Not a Winning Card
1 if Winning Card

Take a look at these URLs.
An activity will be posted. Summary of the App:
- Create a BINGO Card App
- Data for the Card is from the URLs above.
- A Player can join and check to a Game.

*/

const App = () => {
  const [cards, setCards] = useState(null);
  const [gameCode, setGameCode] = useState('');

  return (
    <div className="App">
      <div className='container'>
        {cards === null ? <GameCodeInput callback={setCards} codeCallback={setGameCode} /> : <GameCard data={cards} callback={setCards} code={gameCode} />}
      </div>
    </div>
  );
}

const GameCard = ({ data, callback, code }) => {
  const token = data.playcard_token;
  const card = data.card;
  const key = useRef(0);
  const [reloadKey, setReloadKey] = useState(0);

  const handleNewCardClick = (e) => {
    e.preventDefault();

    const apiUrl = "http://www.hyeumine.com/getcard.php?bcode=";

    axios.get(apiUrl + code)
      .then(response => {
        if (response.data) {
          callback(response.data);
          setReloadKey(reloadKey + 1);
        } 
      })
      .catch(error => {
        alert("invalid game code!");
      });
  }

  const handleCheckCardClick = (e) => {
    e.preventDefault();

    const apiUrl = "http://www.hyeumine.com/checkwin.php?playcard_token=";

    axios.get(apiUrl + token)
    .then(response => {
      if (response.data) alert("Bingo!");
      else alert("No bingo :(");
    })
    .catch(error => {
      alert("invalid game code!");
    });
}

  return (
    <div key={reloadKey} className='container-vertical'>
      <h1>{"Game Code: " + code}</h1>
      <div className='container'>
        <div className="container-vertical">
          <h1>B</h1>
          {card?.B.map((num) => (<GameNumber key={key.current++} number={num} />))}
        </div>
        <div className="container-vertical">
          <h1>I</h1>
          {card?.I.map((num) => (<GameNumber key={key.current++} number={num} />))}
        </div>
        <div className="container-vertical">
          <h1>N</h1>
          {card?.N.map((num) => (<GameNumber key={key.current++} number={num} />))}
        </div>
        <div className="container-vertical">
          <h1>G</h1>
          {card?.G.map((num) => (<GameNumber key={key.current++} number={num} />))}
        </div>
        <div className="container-vertical">
          <h1>O</h1>
          {card?.O.map((num) => (<GameNumber key={key.current++} number={num} />))}
        </div>
      </div>
      <div className='container btn-container'>
      <Button
        className='game-card-btn'
        variant="outlined"
        color="success"
        onClick={handleCheckCardClick}
      >Check Card</Button>
      <Button
        className='game-card-btn'
        variant="contained"
        onClick={handleNewCardClick}
      >New Card</Button>
      </div>

    </div>
  );
}

const GameNumber = ({ number }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className={"container game-number" + (clicked ? " clicked" : "")} onClick={() => {setClicked(!clicked);}}>
      {number}
    </div>
  );
}

const GameCodeInput = ({ callback, codeCallback }) => {
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const handleClick = (e) => {
    e.preventDefault();

    if (value === '') return;

    const apiUrl = "http://www.hyeumine.com/getcard.php?bcode=";

    axios.get(apiUrl + value)
      .then(response => {
        if (response.data) {
          callback(response.data);
          codeCallback(value);
        } 
      })
      .catch(error => {
        alert("invalid game code!");
      });
  }

  useEffect(() => {
    setDisabled(value === '' ? true : false);
  }, [value]);

  return (
    <div className='container-vertical'>
      <label className="form-label" htmlFor="game-code">Enter game code</label>
      <input
        className="textfield"
        label="Enter game code:"
        type="text"
        id="game-code"
        value={value}
        onChange={handleChange} />
      <Button
        className="form-button"
        variant="contained"
        color="success"
        size="medium"
        onClick={handleClick}
        disabled={disabled}>Join</Button>
    </div>
  );
}

export default App;
