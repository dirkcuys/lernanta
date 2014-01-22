from django.template.loader import render_to_string

from apps.projects.models import Project
import os
import shutil

def make_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def export_course(base_dir, course):
    #create folder
    course_folder = os.path.join(base_dir, course.get_absolute_url().strip('/'))
    print(course_folder)
    make_dir(course_folder)

    # Copy images for course
    new_image_path = os.path.join(
        base_dir, 'img', course.slug, 'thumb' + os.path.splitext(course.image.path)[1]
    )
    print(new_image_path)
    print(course.image.path)
    make_dir(os.path.dirname(new_image_path))
    shutil.copyfile(course.image.path, new_image_path)
    image_url = u'/img/' + course.slug + '/thumb' + os.path.splitext(course.image.path)[1]

    context = {
        'course': course,
        'course_image': image_url,
        'course_pages': course.pages.filter(deleted=False, listed=True).order_by('index')
    }
    course_about = render_to_string('jekyll_export/course_about.html', context)
    with open(os.path.join(course_folder, 'index.html'), 'w') as output:
        output.write(course_about.encode("UTF-8"))
    
    make_dir(os.path.join(course_folder, 'content'))
    for page in course.pages.filter(deleted=False, listed=True).order_by('index'):
        page_folder = os.path.join(base_dir, page.get_absolute_url().strip('/'))
        make_dir(page_folder)
        context = {
            'course': course,
            'course_image': image_url,
            'page': page
        }
        course_page = render_to_string('jekyll_export/course_page.html', context)
        with open(os.path.join(page_folder, 'index.html'), 'w') as page_file:
            page_file.write(course_page.encode("UTF-8"))


def export_courses(base_dir):
    for course in Project.objects.filter(deleted=False, test=False):
        export_course(base_dir, course)
