import React from 'react'
import {Link, useNavigate } from 'react-router-dom';
import {ShieldOff, ArrowLeft, Home} from 'lucide-react';
import {motion} from 'framer-motion';

export default function Unauthorized () {
  const navigate=useNavigate();
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-background p-4 pt-24'>
        <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            className='max-w-2xl w-full text-center space-y-8'
        >
            <motion.div
                initial={{scale:0}}
                animate={{scale:1}}
                transition={{delay:0.2, type:"spring"}}
                className="flex justify-center"
            >
                <div className='w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex item-center justify-center'>
                    <ShieldOff className='text-primary' size={48}/>
                </div>
            </motion.div>
            <div>
                <h1 className='text-bxl md:text-9xl font-black tracking-tighter text-primary/20 leading-none'>
                    403
                </h1>
            </div>
            <div className='space-y-2'>
                <h2 className='text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase'>
                    Aceess Denied
                </h2>
                <div className='w-16 h-1 bg-primary mx-auto'/>
            </div>
            <p className='text-sm md:text-base text-foreground/60 tracking-wide max-w-md max-auto'>
                You don't have permission to access this page. This area is restricted to authorized users only.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-4'>
                <button
                    onClick={()=>navigate(-1)}
                    className='px-8 py-3.5 bg-background border border-border text-foreground
                    -[10px] font-black uppercase tracking-[0.25em] rounded hover:bg-primary/5 transition-all flex items-center gap-2'
                >
                    <ArrowLeft size={14}/>
                    Go Back   
                </button>
                <Link
                    to="/"
                    className='px-8 py-3.5 bg-primary text-foreground text-[10px] font-black uppercase tracking-[0.25em] rounded hover:bg-accent transition-all shadow-lg shadow-primary/10 flex items-center gap-2'
                >
                    <Home size={14}/>Home
                </Link>
            </div>
            <div className="pt-8">
          <p className="text-[9px] text-foreground/30 tracking-widest uppercase">
            Need access? <Link to="/contact" className="text-foreground border-b border-foreground/20 hover:text-primary transition-colors ml-2">Contact Support</Link>
          </p>
        </div>
        </motion.div>
    </div>
  )
}

