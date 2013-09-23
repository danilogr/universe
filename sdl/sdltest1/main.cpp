#include <stdlib.h>
#include <stdio.h>
#include <SDL/SDL.h>
#include <SDL/SDL_image.h>

int main(int argc, char *argv[])
{


    /* initialize SDL  */
    SDL_Init(SDL_INIT_VIDEO);

    /* Set the title bar */
    SDL_WM_SetCaption("SDL Test", "SDL Test :)");

    /* create window */
    SDL_Surface* screen = SDL_SetVideoMode(640,480, 0, 0);

    SDL_Event event;

    bool end = false;

    while (!end)
    {
        if(SDL_PollEvent(&event)) {

          switch (event.type) {

              case SDL_QUIT:
                  end = true;
              break;

          }

        }


        SDL_UpdateRect(screen, 0,0,0,0);

    }

    SDL_Quit();



    return 0;
}
