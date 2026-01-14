import React from 'react'
import { ChildProps } from '../types'
import Navbar from './_components/navbar'

export default function Layout({ children }: ChildProps) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}
