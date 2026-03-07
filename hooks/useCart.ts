'use client'

import { useState } from "react"
import type {Produce} from '@/components/ProduceCard';

export interface CartItem extends Produce{
    quantity: number;
}

export function useCart(){
    const [items, setItems]=useState<CartItem[]>([]);
    const [isOpen, setIsOpen]=useState(false);

    const addToCart = (produce: Produce)=>{
        setItems((prev)=>{
            const exists=prev.find((i)=>i.id===produce.id);
            if(exists)
                return prev.map((i)=>i.id===produce.id ? {...i, quantity: i.quantity+1}:i);
            return [...prev,{...produce, quantity:1}];
        });
        setIsOpen(true);
    };
    const increment=(id: string)=>{
        setItems((prev)=> prev.map((i)=> i.id ===id? { ...i, quantity: i.quantity+1}:i));
    }
     const decrement=(id: string)=>{
        setItems((prev)=> prev.map((i)=> i.id===id && i.quantity > 1 ? { ...i, quantity: i.quantity-1}:i).filter((i)=>i.quantity>0));
    }
    const remove =(id: string)=>
        setItems((prev)=> prev.filter((i)=> i.id!==id));

    const total = items.reduce((sum, i)=> sum+i.price*i.quantity, 0);
    return { items, isOpen, setIsOpen, addToCart, increment, decrement, remove, total };
}