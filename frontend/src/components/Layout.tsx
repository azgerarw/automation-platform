import { BsTwitterX } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { SlSocialFacebook, SlSocialInstagram, SlSocialLinkedin, SlSocialYoutube } from "react-icons/sl";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "./Button";
import { useAuth } from "../context/authContext";

export default function Layout() {
    

    const { userSession, setUserSession, userID, setUserID, userRole } = useAuth();
    

    
    const navigate = useNavigate();
    const navTo = (path: string) => {
        navigate(path);
    }
    
    const logOut = async () => {
        
        const res: Response = await fetch('http://localhost:3000/users/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (res.ok) {
            setUserSession(false);
            setUserID(null);
            navTo('/');
        } else {
            console.error('Logout failed');
        }
    }
    
    const liData = {
        'user': {
            'home': {
                'path': '/',
                'label': 'Home',
                'type': 'link'
            },
            'dashboard': {
                'path': '/Dashboard',
                'label': 'Dashboard',
                'type': 'link'
            },
            'profile': {
                'path': '/Profile',
                'label': 'Profile',
                'type': 'link'
            },
            'logout': {
                'path': '/',
                'label': 'Logout',
                'type': 'button',
                'onClick': logOut
            }
        },
        'guest': {
            'home': {
                'path': '/',
                'label': 'Home',
                'type': 'link'
            },
            'register': {
                'path': '/Register',
                'label': 'Register',
                'type': 'link'
            },
            'login': {
                'path': '/Login',
                'label': 'Login',
                'type': 'button',
                'onClick': (() => navTo('/login'))
            }
        }, 
        'admin': {
            'home': {
                'path': '/',
                'label': 'Home',
                'type': 'link'
            },
            'admin-panel': {
                'path': '/AdminPanel',
                'label': 'Admin Panel',
                'type': 'link'
            },
            'logout': {
                'path': '/',
                'label': 'Logout',
                'type': 'button',
                'onClick': logOut
            }
        }
    } as const;

    useEffect(() => {
      
        userID ? console.log('User ID:', userID) : console.log('Anonymous user is browsing the site.');
        console.log('User role:', userRole);
      }, [userID, userRole]);


    return (
      <><div className=''>
            <header className="border-b-2 border-solid border-t-gray-500">

                <nav className='flex items-center w-[92%] m-auto p-0 '>

                    <span className='font-bold flex-3'>Tasks-Automation</span>

                    <ul className="flex flex-row items-center flex-1">
                        {
                        userSession === true && userRole == "user" &&
                        <>
                        {(Object.keys(liData.user) as Array<keyof typeof liData.user>).map(key => {
                            const item = liData.user[key];

                            if (item.type === 'link') {
                                return (
                                    <li key={key} className='inline-block p-4'>
                                        <Link className="w-fit" to={item.path}>{item.label}</Link>
                                    </li>
                                );
                            }

                            if (item.type === 'button') {
                                return (
                                    <li key={key} className='inline-block p-4'>
                                        <Button onClick={item.onClick}>
                                            {item.label}
                                        </Button>
                                    </li>
                                );
                            }

                            return null;
                        })}
                        </>
                        }
                        {
                        userSession === true && userRole == "admin" &&
                        <>
                        {(Object.keys(liData.admin) as Array<keyof typeof liData.admin>).map(key => {
                            const item = liData.admin[key];

                            if (item.type === 'link') {
                                return (
                                    <li key={key} className='inline-block p-4'>
                                        <Link to={item.path}>{item.label}</Link>
                                    </li>
                                );
                            }

                            if (item.type === 'button') {
                                return (
                                    <li key={key} className='inline-block p-4'>
                                        <Button onClick={item.onClick}>
                                            {item.label}
                                        </Button>
                                    </li>
                                );
                            }

                            return null;
                        })}
                        </>
                        }
                        {userSession === false &&
                        <>
                        {(Object.keys(liData.guest) as Array<keyof typeof liData.guest>).map(key => {
                            const item = liData.guest[key];

                            if (item.type === 'link') {
                                return (
                                    <li key={key} className='inline-block p-4'>
                                        <Link to={item.path}>{item.label}</Link>
                                    </li>
                                );
                            }

                            if (item.type === 'button') {
                                return (
                                    <li key={key} className='inline-block p-4'>
                                        <Button onClick={item.onClick}>
                                            {item.label}
                                        </Button>
                                    </li>
                                );
                            }

                            return null;
                        })}
                        </>
                        }
                    </ul>

            </nav>
        </header>
        
        <main className='text-center min-h-dvh content-center w-full flex items-center justify-center'>
            <Outlet />
        </main>
            
        <footer className=' text-center w-dvw h-48 content-center z-5 flex flex-col gap-3 justify-center border-white border-t-2 border-solid border-t-gray-500'>
            <small className=''>Follow us on social media</small>

            <ul className="flex flex-row justify-center items-center gap-2 p-0">
                <li>
                    <Link to='/'><SlSocialFacebook className='icon' title="facebook" /></Link>
                </li>
                <li>
                    <Link to='/'><SlSocialInstagram className='icon' title="instagram" /></Link>
                </li>
                <li>
                    <Link to='/'><BsTwitterX className='icon' title="twitter" /></Link>
                </li>
                <li>
                    <Link to='/'><FaTiktok className='icon' title="tiktok" /></Link>
                </li>
                <li>
                    <Link to='/'><SlSocialLinkedin className='icon' title="linkedIn" /></Link>
                </li>
                <li>
                    <Link to='/'><SlSocialYoutube className='icon' title="youtube" /></Link>
                </li>
            </ul>
        </footer>
      </div></>
    );
  }