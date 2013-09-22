
//Simple png write example using pngpp
//Developed by TFT

#include <png++/png.hpp>

using namespace png;

int main()
{
	//Constructor with two int parameters: make an empty image
	image<rgb_pixel> img(255,30);

	for(int i=0;i<30;i++)
	{
		for(int j=0;j<255;j++)
		{
			if(i<10)
			{
				rgb_pixel pixel(j,0,0);
				img.set_pixel(j,i,pixel);
			} else if(i<20)
			{
				rgb_pixel pixel(0,j,0);
				img.set_pixel(j,i,pixel);
			} else {
				rgb_pixel pixel(0,0,j);
				img.set_pixel(j,i,pixel);
			}
		}
	}

	//Write png to file
	img.write("image.png");
}
