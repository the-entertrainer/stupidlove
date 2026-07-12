import Spline from '@splinetool/react-spline'

function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
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