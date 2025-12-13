import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Star, Briefcase, Clock, DollarSign, User } from "lucide-react";
import Link from "next/link";
import { serviceRequests, serviceProviders, users } from "@/lib/data";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-headline">Marketplace</h1>
                <Button asChild>
                    <Link href="/services/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post a Request
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="requests">Service Requests</TabsTrigger>
                    <TabsTrigger value="providers">Service Providers</TabsTrigger>
                </TabsList>
                <TabsContent value="requests">
                    <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                        {serviceRequests.map(request => {
                            const student = users.find(u => u.id === request.studentId);
                            const avatar = placeholderImages.find(p => p.id === student?.avatarId);
                            return (
                                <Card key={request.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{request.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{request.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Briefcase className="mr-2 h-4 w-4" />
                                            <span>{request.serviceType}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            <span>Budget: ${request.budget}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-2 h-4 w-4" />
                                            <span>Deadline: {formatDistanceToNow(request.deadline, { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {request.skills.slice(0, 4).map(skill => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center">
                                       {student && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Avatar className="h-8 w-8">
                                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={student.name} />}
                                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{student.name}</span>
                                            </div>
                                       )}
                                       <Button variant="outline">View & Offer</Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="providers">
                     <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                        {serviceProviders.map(provider => {
                             const student = users.find(u => u.id === provider.studentId);
                             const avatar = placeholderImages.find(p => p.id === student?.avatarId);
                             if (!student) return null;
                             return (
                                <Card key={provider.studentId} className="flex flex-col">
                                    <CardHeader className="items-center text-center">
                                        <Avatar className="h-20 w-20 mb-2">
                                            {avatar && <AvatarImage src={avatar.imageUrl} alt={student.name} />}
                                            <AvatarFallback className="text-3xl">{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <CardTitle>{student.name}</CardTitle>
                                        <CardDescription>{provider.tagline}</CardDescription>
                                        <div className="flex items-center pt-2">
                                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                                            <span className="font-bold">{student.rating.toFixed(1)}</span>
                                            <span className="text-muted-foreground ml-1">(from reviews)</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="font-semibold mb-2 text-sm">Top Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {provider.skills.slice(0, 5).map(skill => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                          <Link href={`/profile/${student.id}`}>
                                            <User className="mr-2 h-4 w-4" />
                                            View Profile
                                          </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                             )
                        })}
                     </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
