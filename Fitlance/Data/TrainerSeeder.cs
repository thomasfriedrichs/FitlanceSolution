using Microsoft.AspNetCore.Identity;
using System.Text;
using System.Data;

using Fitlance.Entities;
using Fitlance.Constants;

namespace Fitlance.Data;

public class TrainerSeeder
{
    private readonly UserManager<User> _userManager;
    private readonly ILogger<TrainerSeeder> _logger;

    public TrainerSeeder(UserManager<User> userManager, ILogger<TrainerSeeder> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedTrainers(FitlanceContext dbContext)
    {
        Random random = new();
        List<Trainer> trainers = new();

        for (int i = 1; i <= 1500; i++)
        {
            string gender = GetGender();
            string userId = Guid.NewGuid().ToString();
            string specialization = GetSpecialization();
            int yearsOfExperience = random.Next(1, 20);
            string firstName = GetFirstName(gender);


            // Create a User instance for each Trainer
            var user = new User
            {
                Id = userId,
                UserName = firstName + i,
                Email = firstName + i + "@fitlance.com",
                FirstName = firstName,
                LastName = GetLastName(),
                City = "Seattle",
                ZipCode = GetSeattleZipCode(),
                Bio = GetBio(specialization),
                CreateTime = DateTime.Now,
            };

            var createUserResult = await _userManager.CreateAsync(user, GeneratePassword(16));
            if (createUserResult.Succeeded)
            {
                _logger.LogInformation($"User created successfully: {user.UserName}");
                await _userManager.AddToRoleAsync(user, RoleConstants.Trainer);
            }
            else
            {
                _logger.LogWarning($"Failed to create user: {user.UserName}. Errors: {string.Join(", ", createUserResult.Errors.Select(e => e.Description))}");
                continue;
            }


            var trainer = new Trainer
            {
                TrainerId = userId,
                Gender = gender,
                Specialization = specialization,
                NutritionCertification = GetNutritionCertification(),
                YearsOfExperience = yearsOfExperience, 
                Rating = 3.5 + 1.5 * random.NextDouble(), // Random rating between 3.5 to 5
                CertificationsDelimited = string.Join(";", GetCertifications(specialization) ?? Array.Empty<string>()),
                HourlyRate = 50 + 5 * random.Next(0, 11), // Generates a rate between 50 to 100 in increments of 5
                SecondLanguage = GetSecondLanguage(),
                AvailabilityDelimited = string.Join(";", GetAvailability()),
                ClientSkillDelimited = string.Join(";", GetClientSkill(yearsOfExperience)),
                ReviewCount = random.Next(50),
                ActiveClients = random.Next(15)
            };

            _logger.LogInformation($"Trainer created successfully: {trainer.TrainerId}");

            trainers.Add(trainer);
        }

        dbContext.Trainers.AddRange(trainers);
        await dbContext.SaveChangesAsync();
    }

    private static string GetGender()
    {
        string[] sexes = { "Male", "Female", "Non-Binary" };
        Random random = new();
        int index = random.Next(sexes.Length);
        return sexes[index];
    }


    private static string GetSpecialization()
    {
        string[] specializations = {"Yoga", "Strength", "Endurance", "Pilates", "HIIT"};
        Random random = new();
        int index = random.Next(specializations.Length);
        return specializations[index];
    }

    private static string? GetNutritionCertification()
    {
        string[] certifications = new string[]
        {
            "Registered Dietitian Nutritionist (RDN)",
            "Precision Nutrition Level 1 Certification (Pn1)",
            "ISSA Nutritionist Certification",
            "National Academy of Sports Medicine (NASM) Fitness Nutrition Specialist",
            "International Sports Sciences Association (ISSA) Certified Nutritionist",
            "National Exercise and Sports Trainers Association (NESTA) Fitness Nutrition Coach",
            "American Council on Exercise (ACE) Fitness Nutrition Specialist",
            "Sports Nutritionist Certification from the American Fitness Professionals & Associates (AFPA)",
            "Institute for Integrative Nutrition (IIN) Health Coach Certification",
            "Nutrition Therapy Practitioner (NTP) or Nutritional Consultant (NC) from the Nutritional Therapy Association (NTA)"
        };
        Random random = new();
        if (random.Next(2) == 0)
        {
            return null;
        }
        else
        {
            int index = random.Next(certifications.Length);
            return certifications[index];
        }
    }

    private static string[]? GetCertifications(string specialization)
    {
        Random random = new();

        string[] yogaCerts = {
            "Registered Yoga Teacher 200 Hours",
            "Registered Yoga Teacher 300 Hours",
            "Registered Yoga Teacher 500 Hours",
            "Registered Children's Yoga Teacher",
            "Yoga Alliance Continuing Education Provider"
        };
        string[] strengthCerts = {
            "Certified Strength and Conditioning Specialist",
            "National Strength and Conditioning Association Certified Personal Trainer",
            "National Strength and Conditioning Association Certified Strength and Conditioning Specialist",
            "National Academy of Sports Medicine Certified Personal Trainer",
            "National Academy of Sports Medicine Corrective Exercise Specialist"
        };
        string[] enduranceCerts = {
            "Road Runners Club of America Coaching Certification (RRCA)",
            "USA Cycling Coach Certification",
            "USA Triathlon Coaching Certification",
            "American College of Sports Medicine Certified Exercise Physiologist",
            "National Strength and Conditioning Association Tactical Strength and Conditioning Facilitator (NSCA-TSAC-F)"
        };
        string[] pilatesCerts = {
            "Balanced Body Pilates Instructor Certification",
            "Stott Pilates Certified Instructor",
            "BASI (Body Arts and Science International) Pilates Certification",
            "Polestar Pilates Certification",
            "Classical Pilates Certification by Romana's Pilates"
        };
        string[] hiitCerts = {
            "American Council on Exercise Group Fitness Instructor with HIIT Specialization",
            "National Academy of Sports Medicine Performance Enhancement Specialist",
            "Tabata Bootcamp Instructor Certification",
            "Les Mills GRIT Instructor Certification",
            "Functional HIIT Trainer Certification by the Functional Training Institute"
        };

        string[]? selectedCerts = specialization switch
        {
            "Yoga" => yogaCerts,
            "Strength" => strengthCerts,
            "Endurance" => enduranceCerts,
            "Pilates" => pilatesCerts,
            "HIIT" => hiitCerts,
            _ => null,
        };

        if (selectedCerts == null) return null;

        List<string> certifications = new();
        int numberOfCerts = random.Next(1, 4); 

        for (int i = 0; i < numberOfCerts; i++)
        {
            string cert = selectedCerts[random.Next(selectedCerts.Length)];
            if (!certifications.Contains(cert))
            {
                certifications.Add(cert);
            }
        }

        return certifications.ToArray();
    }

    private static string? GetSecondLanguage()
    {
        Random random = new();

        if (random.Next(10) == 0)
        {
            string[] languages = { "Chinese", "Chinese", "Chinese", "Spanish", "Spanish", "Spanish", "French", "Portuguese", "Japanese", "Hindi" };
            return languages[random.Next(languages.Length)];
        }
        else
        {
            return null;
        }
    }

    private static string[] GetAvailability()
    {
        Random random = new();

        List<string> days = new();
        if (random.Next(5) == 0) // 1 in 5 chance for having both Weekdays and Weekends
        {
            days.Add("WeekDays");
            days.Add("Weekends");
        }
        else
        {
            days.Add(random.Next(2) == 0 ? "WeekDays" : "Weekends");
        }

        string[] hoursOptions = { "Morning", "Afternoon", "Evening" };
        List<string> hours = new();
        while (hours.Count < 2)
        {
            string hour = hoursOptions[random.Next(hoursOptions.Length)];
            if (!hours.Contains(hour))
            {
                hours.Add(hour);
            }
        }

        return days.Concat(hours).ToArray();
    }

    private static string[] GetClientSkill(int yearsOfExperience)
    {
        Random random = new();

        // more experienced trainers are more likely to handle both skill levels
        if (yearsOfExperience <= 5)
        {
            //less experienced trainers have a higher chance of being specialized
            // in either beginner or advanced, but still a chance for both
            int decision = random.Next(100);
            if (decision < 30) // 30% chance for both
            {
                return new[] { "Beginner", "Advanced" };
            }
            else if (decision < 80) // 50% chance for Beginner
            {
                return new[] { "Beginner" };
            }
            else // 20% chance for Advanced
            {
                return new[] { "Advanced" };
            }
        }
        else
        {
            // For more experienced trainers, increase the likelihood for both
            int decision = random.Next(100);
            if (decision < 80) // 80% chance for both
            {
                return new[] { "Beginner", "Advanced" };
            }
            else if (decision < 90) // 10% chance for Beginner
            {
                return new[] { "Beginner" };
            }
            else // 10% chance for Advanced
            {
                return new[] { "Advanced" };
            }
        }
    }

    private static string GeneratePassword(int length = 8)
    {
        Random random = new();

        const string lowerChars = "abcdefghijklmnopqrstuvwxyz";
        const string upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string digitChars = "0123456789";
        const string nonAlphanumericChars = "!@#$%^&*";

        string[] randomChars = new[] {
            lowerChars, upperChars, digitChars, nonAlphanumericChars
        };

        StringBuilder password = new();

        // Ensure each character type is used at least once
        foreach (var charSet in randomChars)
        {
            password.Append(charSet[random.Next(charSet.Length)]);
        }

        // Fill the rest of the password length with random characters from all sets
        string allChars = string.Concat(randomChars);
        while (password.Length < length)
        {
            password.Append(allChars[random.Next(allChars.Length)]);
        }

        // Shuffle the password to randomize character positions
        return new string(password.ToString().ToCharArray().OrderBy(s => random.Next()).ToArray());
    }

    private static string GetFirstName(string gender)
    {
        string[] maleNames = new string[]
        {
            "Aaron", "Adam", "Adrian", "Alan", "Albert",
            "Alex", "Alexander", "Alfred", "Andrew", "Anthony",
            "Arthur", "Austin", "Benjamin", "Blake", "Brad",
            "Bradley", "Brandon", "Brian", "Bruce", "Caleb",
            "Cameron", "Carl", "Charles", "Chris", "Christian",
            "Christopher", "Cody", "Cole", "Colin", "Connor",
            "Craig", "Dale", "Damian", "Daniel", "Darren",
            "David", "Dean", "Derek", "Devin", "Dominic",
            "Donald", "Douglas", "Dylan", "Edward", "Eli",
            "Elijah", "Elliot", "Eric", "Ethan", "Evan",
            "Felix", "Francis", "Frank", "Gabriel", "Gary",
            "George", "Gerald", "Gregory", "Harry", "Hayden",
            "Henry", "Howard", "Hugh", "Ian", "Isaac",
            "Isaiah", "Jack", "Jackson", "Jacob", "James",
            "Jared", "Jason", "Jasper", "Jeffrey", "Jeremy",
            "Jerry", "Jesse", "Jim", "Joel", "John",
            "Jonathan", "Jordan", "Joseph", "Joshua", "Julian",
            "Justin", "Keith", "Kenneth", "Kevin", "Kyle",
            "Lance", "Larry", "Lawrence", "Leo", "Leon",
            "Leonard", "Liam", "Logan", "Louis", "Lucas"
        };
        string[] femaleNames = 
        {
            "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
            "Abigail", "Ada", "Adelaide", "Adele", "Adriana",
            "Agatha", "Agnes", "Aileen", "Aimee", "Alana",
            "Alexandra", "Alice", "Alicia", "Alina", "Alisha",
            "Alison", "Allison", "Alyssa", "Amanda", "Amber",
            "Amelia", "Amy", "Ana", "Anastasia", "Andrea",
            "Angela", "Angelica", "Angelina", "Anita", "Ann",
            "Anna", "Anne", "Annette", "Annie", "Antoinette",
            "April", "Aria", "Ariana", "Ariel", "Ashley",
            "Audrey", "Aurora", "Autumn", "Ava", "Barbara",
            "Beatrice", "Bella", "Bernice", "Beryl", "Beth",
            "Bethany", "Betsy", "Betty", "Beverly", "Bianca",
            "Blanche", "Bonnie", "Brenda", "Briana", "Brianna",
            "Bridget", "Brittany", "Brooke", "Camille", "Candace",
            "Cara", "Carla", "Carmen", "Carol", "Caroline",
            "Carolyn", "Cassandra", "Cassie", "Catherine", "Cecilia",
            "Celeste", "Chantal", "Charlene", "Charlotte", "Chelsea",
            "Cheryl", "Chloe", "Christina", "Christine", "Cindy",
            "Claire", "Clara", "Claudia", "Colette", "Connie",
            "Daisy", "Dana", "Danielle", "Daphne", "Darlene",
            "Elena", "Eliza", "Elizabeth", "Ella", "Ellen",
            "Eloise", "Elsa", "Elsie", "Emily", "Emma",
            "Erica", "Erin", "Esther", "Ethel", "Eunice",
            "Fiona", "Flora", "Florence", "Frances", "Francesca",
            "Gabriella", "Gail", "Georgia", "Geraldine", "Gillian",
            "Gina", "Giselle", "Gloria", "Grace", "Gwendolyn",
            "Hannah", "Harriet", "Hazel", "Heather", "Helen",
            "Helena", "Hilary", "Holly", "Hope", "Irene",
            "Iris", "Isabel", "Isabella", "Isabelle", "Ivy",
            "Jacqueline", "Jade", "Jamie", "Jane", "Janet",
            "Janice", "Jean", "Jeanette", "Jeanne", "Jenna",
            "Joanne", "Jocelyn", "Jodie", "Jody", "Josephine",
        };

        Random random = new();

        if (gender.Equals("Non-Binary", StringComparison.OrdinalIgnoreCase))
        {
            bool chooseMale = random.Next(2) == 0;
            return chooseMale ? maleNames[random.Next(maleNames.Length)] : femaleNames[random.Next(femaleNames.Length)];
        }
        else if (gender.Equals("Male", StringComparison.OrdinalIgnoreCase))
        {
            return maleNames[random.Next(maleNames.Length)];
        }
        else
        {
            return femaleNames[random.Next(femaleNames.Length)];
        }
    }

    private static string GetLastName()
    {
        Random random = new();

        string[] lastNames =
        {
            "Smith", "Johnson", "Williams", "Jones", "Brown",
            "Davis", "Miller", "Wilson", "Moore", "Taylor",
            "Anderson", "Thomas", "Jackson", "White", "Harris",
            "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
            "Clark", "Rodriguez", "Lewis", "Lee", "Walker",
            "Hall", "Allen", "Young", "Hernandez", "King",
            "Wright", "Lopez", "Hill", "Scott", "Green",
            "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
            "Mitchell", "Perez", "Roberts", "Turner", "Phillips",
            "Campbell", "Parker", "Evans", "Edwards", "Collins",
            "Stewart", "Sanchez", "Morris", "Rogers", "Reed",
            "Cook", "Morgan", "Bell", "Murphy", "Bailey",
            "Rivera", "Cooper", "Richardson", "Cox", "Howard",
            "Ward", "Torres", "Peterson", "Gray", "Ramirez",
            "James", "Watson", "Brooks", "Kelly", "Sanders",
            "Price", "Bennett", "Wood", "Barnes", "Ross",
            "Henderson", "Coleman", "Jenkins", "Perry", "Powell",
            "Long", "Patterson", "Hughes", "Flores", "Washington",
            "Butler", "Simmons", "Foster", "Gonzales", "Bryant",
            "Alexander", "Russell", "Griffin", "Diaz", "Hayes"
        };

        return lastNames[random.Next(lastNames.Length)];
    }

    private static int GetSeattleZipCode()
    {
        int[] seattleZipCodes = new int[]
        {
            98101, 98102, 98103, 98104, 98105,
            98106, 98107, 98108, 98109, 98112,
            98115, 98116, 98117, 98118, 98119,
            98121, 98122, 98125, 98126, 98133,
            98134, 98136, 98144, 98146, 98154,
            98164, 98174, 98177, 98178, 98195,
            98199
        };

        Random random = new();
        int index = random.Next(seattleZipCodes.Length);
        return seattleZipCodes[index];
    }

    private static string GetBio(string specialization)
    {
        Dictionary<string, string[]> SpecialtyBios = new()
        {
            ["Yoga"] = new[]
        {
            "Passionate about bringing yoga's peace and mindfulness to everyday life.",
            "Dedicated to helping clients find balance and inner strength through yoga.",
            "Experienced in various styles of yoga, focusing on breath and alignment.",
            "Embracing the ancient art of yoga to enhance mind-body wellness and flexibility.",
            "Skilled in guiding students through meditative and restorative yoga practices.",
            "Yoga enthusiast dedicated to creating a serene and supportive practice environment.",
            "Certified yoga instructor specializing in Vinyasa flow and mindful movement.",
            "Experienced in tailoring yoga sessions to meet individual wellness goals.",
            "Bringing a holistic approach to yoga, integrating physical postures with mindful breathing.",
            "Yoga teacher passionate about helping students connect with their inner peace.",
            "Advocating the transformative power of yoga for physical health and mental clarity.",
            "Expert in Hatha and Ashtanga yoga, focusing on strength, flexibility, and balance.",
            "Creating personalized yoga experiences that promote relaxation and stress relief.",
            "Inspired by the transformative impact of yoga on mental and physical health.",
            "Passionate about sharing the benefits of yoga for all ages and fitness levels.",
            "Integrating traditional yoga techniques with modern fitness trends for a balanced practice.",
            "Yoga practitioner dedicated to fostering a sense of community and connection in classes.",
            "Specializing in therapeutic yoga to aid recovery and enhance overall well-being.",
            "Committed to guiding beginners and advanced yogis in their journey of self-discovery through yoga."
        },
            ["Strength"] = new[]
        {
            "Committed to building strength and resilience through personalized training.",
            "Focusing on strength training to help clients achieve their fitness goals.",
            "Expert in strength conditioning and muscle building techniques.",
            "Passionate about empowering clients to achieve peak physical strength and performance.",
            "Expert in functional strength training, dedicated to enhancing athletic abilities.",
            "Committed to helping clients build muscle, increase strength, and improve fitness.",
            "Strength coach specializing in powerlifting techniques and progressive overload principles.",
            "Focused on crafting personalized strength programs for diverse fitness levels.",
            "Bringing a dynamic approach to strength training, emphasizing proper form and safety.",
            "Experienced in bodybuilding and strength conditioning for optimal physical transformation.",
            "Strength and conditioning specialist with a track record of client success and satisfaction.",
            "Enthusiastic about utilizing innovative strength training methods for maximum gains.",
            "Certified trainer with a passion for helping clients unlock their strength potential.",
            "Expertise in strength training for both rehabilitation and athletic performance enhancement.",
            "Combining nutritional guidance with strength training for holistic fitness development.",
            "Promoting a balanced approach to strength training, blending endurance and flexibility.",
            "Strength trainer dedicated to pushing clients beyond their limits for exceptional results.",
            "Focused on building core strength and stability for improved posture and injury prevention.",
            "Creating motivational strength training environments that inspire progress and determination."
        },
            ["Endurance"] = new[]
        {
            "Specializes in endurance training for athletes and fitness enthusiasts.",
            "Helping clients push their limits and increase their stamina and endurance.",
            "Experienced in designing programs that boost cardiovascular endurance.",
            "Dedicated to enhancing endurance and stamina through tailored cardiovascular training programs.",
            "Specializing in long-distance running coaching, from 5Ks to marathons and beyond.",
            "Passionate about helping athletes improve their endurance for peak performance in competitions.",
            "Experienced in cycling and triathlon training, focusing on endurance, technique, and speed.",
            "Endurance coach committed to helping clients surpass their personal bests and achieve new goals.",
            "Utilizing a blend of interval training and long-distance workouts to boost endurance and resilience.",
            "Expert in creating personalized training plans that progressively build endurance and strength.",
            "Committed to helping clients conquer endurance challenges in sports and daily life.",
            "Focused on endurance training for all levels, from beginners to seasoned athletes.",
            "Bringing a science-based approach to endurance training, optimizing performance and recovery.",
            "Marathon runner and coach, sharing the joy and discipline of long-distance running.",
            "Tailoring endurance training to individual fitness levels and specific event preparation.",
            "Integrating endurance training with nutrition and lifestyle advice for comprehensive fitness.",
            "Guiding clients through endurance milestones with motivation, strategy, and support.",
            "Experienced in coaching clients for endurance events, with a focus on sustainable training methods.",
            "Endurance training expert, passionate about helping clients achieve their distance goals safely and effectively."
        },
            ["Pilates"] = new[]
        {
            "Pilates instructor focused on improving flexibility, strength, and body awareness.",
            "Passionate about Pilates as a way to strengthen the core and improve posture.",
            "Dedicated to creating engaging Pilates sessions for all skill levels.",
            "Certified Pilates instructor committed to improving flexibility, strength, and mind-body awareness.",
            "Passionate about Pilates as a path to a healthier lifestyle and enhanced body alignment.",
            "Dedicated to crafting personalized Pilates routines for all skill levels and body types.",
            "Expert in mat and reformer Pilates, focusing on core strength and postural improvement.",
            "Bringing a holistic approach to Pilates, incorporating elements of mindfulness and relaxation.",
            "Specializing in Pilates for rehabilitation and injury prevention, ensuring safe and effective workouts.",
            "Enthusiastic about empowering clients through Pilates to achieve greater physical balance and coordination.",
            "Pilates teacher with a focus on helping clients connect breath with movement for a transformative experience.",
            "Experienced in dynamic Pilates sessions that challenge and inspire clients to reach their fitness goals.",
            "Advocating Pilates as a versatile fitness discipline suitable for enhancing overall well-being and vitality.",
            "Offering Pilates classes that blend classical techniques with contemporary fitness principles.",
            "Committed to guiding clients through Pilates routines that build core stability and lean muscle.",
            "Pilates enthusiast dedicated to creating an inclusive and supportive environment in every session.",
            "Focused on delivering Pilates instruction that caters to individual needs and fitness aspirations.",
            "Specializing in Pilates for athletes, enhancing performance through targeted core workouts.",
            "Utilizing Pilates as a tool for stress relief and physical rejuvenation, tailored to modern lifestyles."
        },
            ["HIIT"] = new[]
        {
            "High-intensity interval training expert, passionate about dynamic workouts.",
            "Bringing energy and motivation to HIIT sessions for maximum impact.",
            "Focused on HIIT to deliver quick and effective fitness results.",
            "Dynamic HIIT instructor dedicated to delivering high-energy workouts for maximum fitness impact.",
            "Passionate about HIIT's power to transform health and fitness levels rapidly and effectively.",
            "Specializing in HIIT for fast-paced, challenging workouts that boost metabolism and burn fat.",
            "Expert in crafting HIIT routines that balance intensity with proper form and recovery.",
            "Committed to motivating clients through intense HIIT sessions for quick and visible results.",
            "HIIT coach focused on building endurance, strength, and agility through varied, explosive exercises.",
            "Bringing a unique blend of cardio and strength training to HIIT for all-round fitness improvement.",
            "Experienced in designing HIIT programs that are challenging yet adaptable for different fitness levels.",
            "Promoting HIIT as a versatile workout approach suitable for busy lifestyles, with short but effective sessions.",
            "HIIT enthusiast passionate about helping clients push their limits and achieve their peak fitness.",
            "Dedicated to creating high-intensity workouts that are not only challenging but also fun and engaging.",
            "Utilizing HIIT principles to enhance athletic performance and build functional strength.",
            "Offering HIIT training that targets the whole body for balanced muscle development and fat loss.",
            "HIIT trainer committed to guiding clients safely through intense workout routines for optimal health.",
            "Focused on delivering energizing HIIT sessions that leave clients feeling invigorated and accomplished.",
            "Expert in incorporating a variety of equipment and bodyweight exercises for diverse and effective HIIT workouts."
        }
        };
        Random random = new();

        if (SpecialtyBios.TryGetValue(specialization, out var bios))
        {
            int index = random.Next(bios.Length);
            return bios[index];
        }

        return "Dedicated fitness professional with a passion for helping clients achieve their goals.";
    }
}