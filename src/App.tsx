import Spline from '@splinetool/react-spline'

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: '#000000' 
    }}>
      <Spline 
        scene="https://prod.spline.design/PtxdoKRiTEQr4Smp/scene.splinecode" 
        style={{ width: '100%', height: '100%' }}
        onLoad={() => {
          console.log('Spline scene loaded successfully')
        }}
      />
    </div>
  )
}

export default App