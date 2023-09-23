import React from 'react';

const Layout = (props) => {
    return (
        <div >
            <main>
                <div className='mx-auto py-6'>
                    {props.children}
                </div>
            </main>
        </div>
    )
}
export default Layout;