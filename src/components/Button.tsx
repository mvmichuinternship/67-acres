import React from 'react'
import cn from 'clsx';

const Button = ({title, onClick, className} : {title: string, onClick: (e: React.MouseEvent<HTMLButtonElement>)=> void, className?:string;}) => {
  return (
    <div className=" ">
        <button className={cn(className,`bg-blue-400 text-white rounded-md p-1 w-full hover:bg-blue-500 transition`)} onClick={onClick}>
        {title}
        </button>
    </div>
  )
}

export default Button