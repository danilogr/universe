#ifndef __IMAGE_BASE__
#define __IMAGE_BASE__

#include <iostream>
#include <cstdio>
#include <cstring>


namespace mycv {


/** 

*/
template< typename PixelType >
class Image 
{
public:

	Image() :
		m_rows( 0 ),
		m_cols( 0 ),
		m_data( NULL )
	{
		///
	}	

	Image( unsigned int rows, unsigned int cols ) :
		m_rows( rows ),
		m_cols( cols ),
		m_data( new PixelType[rows * cols] )
	{
		///
	}

	Image( Image< PixelType >& rhs )
	{
		if( this != &rhs )
		{
			m_rows = rhs.m_rows;
			m_cols = rhs.m_cols;
			m_data = new PixelType[ rhs.m_rows * rhs.m_cols ];			
			memcpy( m_data, rhs.m_data, m_rows * m_cols * sizeof(PixelType) );
		}
	}

	virtual ~Image()
	{
		if( m_data != NULL )
			delete [] m_data;
	}

	void SetSize( unsigned int rows, unsigned int cols )
	{
		if( m_data == NULL )
		{
			m_rows = rows;
			m_cols = cols;
			m_data = new PixelType[ m_rows * m_cols ];			
		} else {
			/// TODO
		}
	}

	unsigned int GetRows() const
	{
		return m_rows;
	}

	unsigned int GetCols() const
	{
		return m_cols;
	}

	PixelType GetPixel( unsigned int r, unsigned int c ) const
	{
		if( isInBounds(r, c) )
			return m_data[ r*m_cols + c ];
	}

	void SetPixel( unsigned int r, unsigned int c, PixelType val )
	{
		if( isInBounds(r, c) )
			m_data[ r*m_cols + c ] = val;
	}

	Image& operator = ( Image< PixelType >& rhs )
	{
		if( this != &rhs )
		{
			Image< PixelType > tmp( rhs );

			std::swap( this->m_rows, tmp.m_rows );
			std::swap( this->m_cols, tmp.m_cols );
			std::swap( this->m_data, tmp.m_data );
		}

		return *this;
	}

	Image& Clone()
	{
		Image< PixelType > *tmp = NULL;
		*tmp = *this;
		return &tmp;
	}

protected:


private:
	
	bool isInBounds( unsigned int r, unsigned int c ) const
	{
		return ( r >= 0 && r < m_rows ) && ( c >= 0 && c < m_cols );
	}

	/** 
		Image dimension
	*/
	unsigned int m_rows, m_cols;
	PixelType *m_data;
};


}

#endif