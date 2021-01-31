function App() {
  return (
    <div className='App'>
      <div className='game-area'>
        <div className='snake-body' style={{top: 0, left: 0}}></div>
        <div className='snake-body' style={{top: 0, left: '2%'}}></div>
        <div className='snake-body' style={{top: 0, left: '4%'}}></div>
      </div>
    </div>
  );
}

export default App;
