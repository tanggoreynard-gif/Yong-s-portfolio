import os
from PIL import Image

media_dir = 'scratch/docx_extracted/word/media'
fitco_pub = 'public/samples/fitco'
os.makedirs(fitco_pub, exist_ok=True)

# 1. Hero background gym: from image1.png
im1 = Image.open(f'{media_dir}/image1.png').convert('RGB')
# Gym photo on right: from x=530 to 1429, y=65 to 645
gym_right = im1.crop((530, 65, 1429, 645))
gym_right.save(f'{fitco_pub}/hero-gym-full.jpg', quality=95)
print('hero-gym-full.jpg saved:', gym_right.size)

# 2. Section 2: athlete sitting from image2.png
im2 = Image.open(f'{media_dir}/image2.png').convert('RGB')
# athlete on right: from x=730 to 1375, y=65 to 685
athlete = im2.crop((730, 65, 1375, 685))
athlete.save(f'{fitco_pub}/athlete-sitting.jpg', quality=95)
print('athlete-sitting.jpg saved:', athlete.size)

# 3. Section 7: Coach Alex from image7.png
im7 = Image.open(f'{media_dir}/image7.png').convert('RGB')
# Coach on left: from x=135 to 570, y=160 to 685
coach = im7.crop((135, 160, 570, 685))
coach.save(f'{fitco_pub}/coach-alex-full.jpg', quality=95)
print('coach-alex-full.jpg saved:', coach.size)

# 4. Section 11: Call to Action background from image11.png
im11 = Image.open(f'{media_dir}/image11.png').convert('RGB')
# Banner background: crop the industrial lime graphic without text if possible or with text
banner = im11.crop((0, 48, 1429, 348))
banner.save(f'{fitco_pub}/cta-turning-point.jpg', quality=95)
print('cta-turning-point.jpg saved:', banner.size)

print('All FitCo docx assets successfully extracted!')
