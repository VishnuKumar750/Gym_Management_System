import gymPoster from '@/assets/gym_login_poster.webp';

import { Card, CardHeader, CardTitle, CardDescription, CardContent,  CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useState } from 'react';
import { useAuth } from './context/Auth';





function AdminLoginForm () {

  const [ adminId, setAdminId ] = useState('');
  const [ password, setPassword ] = useState('');

  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    console.log('clicked')
    if(adminId && password) {
      login({ email: adminId })
    }
  }

    return (
    <div className="w-full max-w-sm bg-white rounded-md">
      <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your AdminId below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">AdminId</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" onClick={handleLogin} className="w-full bg-neutral-900 hover:bg-neutral-950  text-white">
          Login
        </Button>
      </CardFooter>
      </Card>
    </div>
  );
}

// login form - form for admin login / user login
function UserLoginForm ( ) {

  return (
    <div className="w-full max-w-sm bg-white rounded-md">
      <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your UserId below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">UserId</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-950  text-white">
          Login
        </Button>
      </CardFooter>
      </Card>
    </div>
  );
}



const AuthForm = () => {


  return (
    <div className='relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2'>
       <div className='relatve  w-full h-full lg:h-svh'>
        <img className='w-full h-full object-fill' src={gymPoster} alt="gym_poster" />
       </div>
       <div className='w-full h-full absolute lg:relative flex items-center justify-center '>
        <Tabs defaultValue='admin' className='w-full max-w-sm'>
            <TabsList className="flex gap-4 max-w-fit p-3 rounded-xl">
            <TabsTrigger
                value="admin"
                className="
                data-[state=active]:bg-neutral-700 
                data-[state=active]:text-white  
                data-[state=inactive]:text-neutral-900 
                data-[state=inactive]:bg-neutral-300
                px-4 py-2 rounded-md 
                transition-all 
                hover:bg-neutral-500
                font-bold
                "
            >
                Admin
            </TabsTrigger>

            <TabsTrigger
                value="user"
                className="
                data-[state=active]:bg-neutral-700 
                data-[state=active]:text-white  
                data-[state=inactive]:text-neutral-900 
                data-[state=inactive]:bg-neutral-300
                font-bold
                px-4 py-2 rounded-md 
                transition-all 
                hover:bg-neutral-800
                "
            >
                User
            </TabsTrigger>
            </TabsList>

            <TabsContent value='admin'>
                <AdminLoginForm />
            </TabsContent>
            <TabsContent value='user'>
                <UserLoginForm  />
            </TabsContent>
        </Tabs>
       </div> 
    </div>
  )
}

export default AuthForm
