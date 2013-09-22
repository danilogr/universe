
//Simple png read example using pngpp
//Developed by TFT

#include "png++/png.hpp"

using namespace png;

int main()
{
	//Constructor with one string parameter: open a png file
	image<rgb_pixel> img("image.png");

	for(int i=0;i<img.get_width();i++)
	{
		for(int j=0;j<img.get_height();j++)
		{
			rgb_pixel pixel=img.get_pixel(i,j);
			//Replace blue pixels with yellow pixels
			if(pixel.blue>0)
			{
				rgb_pixel newPixel(pixel.blue,pixel.blue,0);
				img.set_pixel(i,j,newPixel);
			}
		}
	}

	img.write("new_image.png");
}
