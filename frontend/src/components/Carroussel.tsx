// src/components/charts/InstitutionsCarousel.jsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const institutions = [
  {
    id: 1,
    name: "Hospital Central",
    location: "Buenos Aires, Argentina",
    needed: "O+, A-",
  },
  {
    id: 2,
    name: "Fundación HemoVida",
    location: "Córdoba, Argentina",
    needed: "Todos los tipos",
  },
  {
    id: 3,
    name: "Banco de Sangre Nacional",
    location: "Rosario, Argentina",
    needed: "B+",
  },
  {
    id: 4,
    name: "Clínica de la Esperanza",
    location: "Mendoza, Argentina",
    needed: "AB+",
  },
  {
    id: 5,
    name: "Instituto de Hematología",
    location: "La Plata, Argentina",
    needed: "O-",
  },
];

export function InstitutionsCarousel() {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,     
        }}
        className="w-full"
      >
        <CarouselContent>
          {institutions.map((inst) => (
            <CarouselItem 
              key={inst.id} 
              // Aquí está la magia de las 3 cards:
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{inst.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      {inst.location}
                    </p>
                    <p className="text-sm font-medium">
                      Necesita:{" "}
                      <span className="font-bold text-destructive">
                        {inst.needed}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}