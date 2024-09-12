namespace  SoftwareProject.Service{

    public class CategoryService{
    public Dictionary<string, List<string>> categories = new Dictionary<string, List<string>>
    {

        {"Candies",new List<string>{"candy","gummy","marshmallow", }},
        { "Sweets", new List<string> {  "sweet",  "chocolate", "toffee",
        "bonbon", "lollipop", "fudge", "nougat" } },
        { "Fruits", new List<string> { "apple", "banana", "berry", "orange", "clementine", "lemon", "kiwi",
        "figs", "lime", "cherry", "plum", "watermelon", "grape", 
        "peach", "berries", "coconut", "guava", "mango",
        "papaya", "pineapple", "pomegranate", "apricot",
        "nectarine", "pear" } },
        { "Dairy", new List<string> { "milk", "yogurt", "cheese", "butter", "cream", "curd",
        "buttermilk", "whey", "ghee", "kefir" } },
        { "DairyFree", new List<string> { "oat drink", "almond milk", "coconut milk", "soy milk",
        "rice milk", "hemp milk", "cashew milk", "pea milk", "hazelnut milk", "macadamia milk" } },
        { "Bread", new List<string> { "bread", "loaf", "baguette", "roll", "sourdough", "ciabatta",
        "focaccia", "pita", "naan", "toast", "brioche", "wholemeal", "rye", "multigrain", "flatbread" } },
        { "Bath and Body", new List<string> { "body wash", "lotion", "moisturizer", "scrub", "soap", "shower gel", "bath bomb", "body butter", "cream", "oil", "scented", "exfoliant" ,"razor","lotion","skin","lip",} },
        { "Cosmetics", new List<string> {"skin","lip color","nail","foundation", "lipstick", "mascara", "eyeshadow", "blush", "concealer", "powder", "nail polish", "eyeliner", "makeup remover", "primer", "highlighter", "bronzer","makeup brushes" } },
        { "Cookies and Biscuits", new List<string> { "cookie", "biscuit", "digestive", "shortbread", "oreo", "chocolate chip", "gingerbread", "wafer", "cracker", "tea biscuit", "butter cookie", "sandwich cookie" } },
        { "Pasta and Noodles", new List<string> { "pasta", "spaghetti", "penne", "fusilli", "macaroni", "noodle", "ramen", "udon", "soba", "lasagna", "fettuccine", "tagliatelle", "rice noodle" } },
        { "Sauces", new List<string> { "sauce", "ketchup", "mustard", "barbecue", "soy sauce", "hot sauce", "pasta sauce", "salad dressing", "gravy", "teriyaki", "vinaigrette", "salsa", "marinara" } },
        { "Meat, Fish, and Eggs", new List<string> { "chicken", "beef", "pork", "lamb", "fish", "salmon", "tuna", "cod", "trout", "shrimp", "prawn", "egg", "bacon", "sausage", "ham", "turkey", "duck","salami",
        } },
        { "Bakes and Cakes", new List<string> { "cake", "bake", "brownie", "muffin", "cupcake", "pastry", "scone", "tart", "pudding", "cheesecake", "pound cake", "layer cake", "fruitcake" ,"birthday cake"} },
        { "Tea ", new List<string> { "black tea", "green tea", "herbal tea", "oolong tea", "white tea", "chai"  } },
        { " Coffee", new List<string> {  "espresso", "latte", "cappuccino", "americano", "macchiato", "mocha", "cold brew", "iced coffee", "decaf coffee", "instant coffee", "turkish coffee", "french press", "drip coffee" } }

    };

    public string CategorizeProduct(string productName)
    {
        foreach (var category in categories)
        {
            if (category.Value.Any(keyword => productName.ToLower().Contains(keyword)))
            {
                return category.Key;
            }
        }
        return "Uncategorized"; // Default category if no match is found
    }

    }
}