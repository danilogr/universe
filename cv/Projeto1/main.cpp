
#include <iostream>
#include <cstdlib>
#include <algorithm>
#include "Image.h"

int main( int argc, char **argv )
{
	/// 
	typedef unsigned int PixelType; 
	unsigned int nRows = 10;
	unsigned int nCols = 10;

	/// Create an image object
	mycv::Image< PixelType > img1( nRows, nCols );

	/// Test -> set all pixels to 250
	for( unsigned int i=0; i < nRows; i++ )
		for( unsigned int j=0; j < nCols; j++ )
			img1.SetPixel( i, j, 250 );

	/// Example: use of copy constructor
	mycv::Image< PixelType > img2( img1 );

	/// Example: use of operator assignment
	mycv::Image< PixelType > img3;
	img3 = img2;

	/// Test -> print out all pixels
	std::cout << std::endl << std::endl;
	for( unsigned int i=0; i < nRows; i++ )
	{
		for( unsigned int j=0; j < nCols; j++ )
			std::cout << img3.GetPixel(i, j) << " ";
		std::cout << std::endl;
	}

	return( EXIT_SUCCESS );
}
