#   CMakeLists.txt file that creates a project based on the directory name
# and includes all .cpp and .h files in the list of dependencies
#
# A great drop-in for small projects
#
# Source:
# http://stackoverflow.com/questions/12344368/automatically-use-the-directory-as-the-project-name-in-cmake
# http://stackoverflow.com/questions/3201154/cmake-automatically-add-all-files-in-a-folder-to-a-target
#

cmake_minimum_required(VERSION 2.8)

get_filename_component(ProjectId ${CMAKE_CURRENT_SOURCE_DIR} NAME)
string(REPLACE " " "_" ProjectId ${ProjectId})
project(${ProjectId})

file(GLOB PROJECT_SRC
    "*.h"
    "*.cpp"
)

add_executable(${ProjectId} ${PROJECT_SRC})
