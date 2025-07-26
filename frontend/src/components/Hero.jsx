import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import CallingImage from '../assets/CallingImage-4.png';


const Hero = () => {
    return (
        <>
            <main className="block flex h-[50rem] bg-gray-900 text-white">
                <div className="w-1/2 p-[7rem] flex flex-col gap-y-[1.5rem]">
                    <div className="tag py-[5px] px-[20px] border border-solid w-fit rounded-3xl flex items-center">Connect<FontAwesomeIcon icon={faCircle} className="mx-2 text-[8px]" />Collaborate<FontAwesomeIcon icon={faCircle} className="mx-2 text-[8px]" />Communicate</div>
                    <h1 className='text-6xl'>Experience seamless meetings with crystal-clear video and real-time collaboration — <span className='text-cyan-400'>anytime</span>, <span className='text-cyan-400'>anywhere</span>.</h1>
                    <div className="buttons flex gap-[2rem] flex items-center">
                        <Link to="/signup" className='w-fit bg-cyan-400 text-gray-900 px-4 py-1 rounded-lg'>Get Started</Link>
                        <Link to="/main" className="">Learn More <FontAwesomeIcon icon={faArrowRight} /></Link>
                    </div>
                </div>

                <div className="w-1/2 p-[7rem]">
                    <img src={CallingImage} alt="Video Call" className="w-full h-auto" />
                </div>
            </main>
        </>
    )
}

export default Hero;