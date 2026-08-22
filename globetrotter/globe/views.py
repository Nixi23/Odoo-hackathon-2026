from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Traveller
from django.contrib.auth.hashers import make_password
from django.shortcuts import render


@csrf_exempt
def insert_traveller(request):

    if request.method != 'POST':
        return HttpResponse(
            "Only POST method is allowed",
            status=405
        )

    try:
        # Text fields
        firstname = request.POST.get("firstname")
        lastname = request.POST.get("lastname")
        phone = request.POST.get("phone")
        city = request.POST.get("city")
        country = request.POST.get("country")
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Image file
        profile_img = request.FILES.get("profile_img")

        # Debug - check whether image reached Django
        print("Uploaded files:", request.FILES)
        print("Profile image:", profile_img)

        # Required fields
        if not firstname or not lastname or not phone or not city or not country or not email or not password:
            return HttpResponse(
                "All fields are required",
                status=400
            )

        # Duplicate email
        if Traveller.objects.filter(email=email).exists():
            return HttpResponse(
                "Email already exists",
                status=400
            )

        # Hash password
        hashed_password = make_password(password)

        # Create Traveller
        traveller = Traveller.objects.create(
            firstname=firstname,
            lastname=lastname,
            phone=phone,
            city=city,
            country=country,
            email=email,
            password=hashed_password,
            profile_img=profile_img
        )

        # Save explicitly
        traveller.save()

        return HttpResponse(
            f"Traveller created successfully. "
            f"Traveller ID: {traveller.id}. "
            f"Profile image: {traveller.profile_img.name if traveller.profile_img else 'No image uploaded'}",
            status=201
        )

    except Exception as e:
        return HttpResponse(
            f"Error: {str(e)}",
            status=500
        )



# Login page
def login_page(request):
    return render(request, 'login.html')


# Check login credentials
@csrf_exempt
def check_emailpswd(request):
    if request.method != 'POST':
        return HttpResponse(
            "Invalid request method",
            status=405
        )
    try:
        email = request.POST.get('email')
        password = request.POST.get('password')
        if not email or not password:
            return HttpResponse(
                "Email and Password are required",
                status=400
            )
        traveller = Traveller.objects.filter(email=email).first()
        if traveller is None:
            return HttpResponse(
                "Email or password required",
                status=404
            )
        if traveller.password != password:
            return HttpResponse(
                "Email or password required",
                status=401
            )
        return HttpResponse(
            f"Login successful! Welcome {traveller.firstname}. "
            f"Traveller ID: {traveller.id}",
            status=200
        )
    except Exception as e:
        return HttpResponse(
            f"Error: {str(e)}",
            status=500
        )