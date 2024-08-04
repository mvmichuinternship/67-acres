import React, { ReactNode } from 'react'
import cn from 'clsx'

const Container = ({children, className} : {children : ReactNode, className?:string}) => {
  return (
    <div className={cn('w-full h-auto flex flex-col sm:flex-row gap-x-3 gap-y-3 flex-nowrap justify-center items-center  sm:p-10',className)}>{children}</div>
  )
}

export default Container