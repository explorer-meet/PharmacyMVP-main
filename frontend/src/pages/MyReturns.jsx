import Navbar from '../components/Navbar';
import ReturnsPanel from '../components/ReturnsPanel';

const MyReturns = () => {

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-gradient-to-b from-rose-50 via-slate-50 to-white px-4 sm:px-6 lg:px-8 pb-12"
        style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 2rem)' }}
      >
        <ReturnsPanel />
      </div>
    </>
  );
};

export default MyReturns;
