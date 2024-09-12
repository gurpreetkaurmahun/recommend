import React from 'react';


const ImageSlider = () => {
  const images = [
    'https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-2foodgroups_vegetables_detailfeature.jpg?sfvrsn=226f1bc7_6',
    'https://cdn.prod.website-files.com/63f6e52346a353ca1752970e/644fb7a65f01016bb504d02c_20230501T1259-553128f8-5bb8-4582-81d0-66fae3937e6f.jpeg',
    'https://media.product.which.co.uk/prod/images/original/11e6f26a8eb2-strawberry-cornetto-style-ice-cream-lifestyle.jpg',
    'https://t4.ftcdn.net/jpg/06/42/37/41/360_F_642374127_Mw1lAR6BSUwUt2qZyaPNPOmc7XLmyCBw.jpg',
    'https://media.istockphoto.com/id/1349239413/photo/shot-of-coffee-beans-and-a-cup-of-black-coffee-on-a-wooden-table.jpg?s=612x612&w=0&k=20&c=ZFThzn27DAj2KeVlLdt3_E6RJZ2sbw2g4sDyO7mYvqk=',
    'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/57618e37-2445-4835-b872-5af36ac5dcb0/Derivates/588f2b19-6a23-4643-a59e-8335def06f79.jpg',
    'https://i0.wp.com/www.bonaccordaberdeen.com/wp-content/uploads/2023/01/Sainsburys-Logo-600x600-1.webp',
    'https://images.immediate.co.uk/production/volatile/sites/30/2022/07/Avocado-sliced-in-half-ca9d808.jpg',
    'https://assets.sainsburys-groceries.co.uk/gol/7903065/1/640x640.jpg',
    'https://www.shape.com/thmb/Un9ZcomP7xyUTI9RobuzQNfODrM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Benefits-of-Edamame-GettyImages-1353712599-6ab843f27ac04b9da945a58543018caf.jpg',
    'https://swolverine.com/cdn/shop/articles/What_Are_Whole_Grains_And_Why_Are_They_Important_-_Swolverine_800x.jpg?v=1600716204',
    'https://www.100daysofrealfood.com/wp-content/uploads/2023/09/shutterstock_23429146-800x545.jpg',
    'https://www.mayoclinichealthsystem.org/-/media/national-files/images/hometown-health/2021/eggs-in-a-wood-bowl.jpg?sc_lang=en'
  ];

  const images1 = [
    'https://cdn.britannica.com/14/167214-050-3F143067/Cheese-assortment-Blue-cheese-swiss-Brie-parmesan.jpg',
    'https://cdn.dribbble.com/users/432077/screenshots/2731784/attachments/553941/asda2.jpg',
    'https://m.media-amazon.com/images/I/618NcNiaTcL._AC_SX679_PIbundle-4,TopRight,0,0_SH20_.jpg',
    'https://londongrocery.net/cdn/shop/products/salmon_fillet_600x.png?v=1613184767',
    'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQTHRUot_r6lmUIe06bxYEsWhY8gi4r2CglpMJ1ZAeaurtXO64iQUm5JQWIU25GAjlBtc_tkSmu4o3UMcxfzkRDKpTR2v6kD07VoybtsONc3wc1iP0wb8xc-PTRLKIPeArKsIOC7q7eFg&usqp=CAc',
    'https://www.ocado.com/productImages/103/10397011_0_640x640.jpg?identifier=6e888fc25dfc2ddaab4d929a07bd5d13',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyamIS1zm3jeiCSTK6ByvFTUQ4fPuWmHudwA&s',
    'https://wimpoleclinic.com/wp-content/uploads/2024/01/Is-Olive-Oil-Good-for-Hair-Growth-Benefits-Risks-and-Uses.jpg',
    'https://www.savethestudent.org/uploads/Sandwich-crisps-walkers-cheese-onion-innocent-smoothie-meal-deal.jpg',
    'https://www.shape.com/thmb/Un9ZcomP7xyUTI9RobuzQNfODrM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Benefits-of-Edamame-GettyImages-1353712599-6ab843f27ac04b9da945a58543018caf.jpg',
    'https://swolverine.com/cdn/shop/articles/What_Are_Whole_Grains_And_Why_Are_They_Important_-_Swolverine_800x.jpg?v=1600716204',
    'https://www.100daysofrealfood.com/wp-content/uploads/2023/09/shutterstock_23429146-800x545.jpg',
    'https://www.mayoclinichealthsystem.org/-/media/national-files/images/hometown-health/2021/eggs-in-a-wood-bowl.jpg?sc_lang=en'
  ];

  
  return (
    <div className="slider" style={{marginTop:100}}>
      <div className="slides">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} className="slide-image" />
        ))}
        {/* Duplicate the images for continuous effect */}
        {images.map((image, index) => (
          <img key={index + images.length} src={image} alt={`Slide ${index}`} className="slide-image" />
        ))}
      </div>

      <div className="slides" style={{marginTop:50}}>
        {images1.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} className="slide-image" />
        ))}
        {/* Duplicate the images for continuous effect */}
        {images1.map((image, index) => (
          <img key={index + images.length} src={image} alt={`Slide ${index}`} className="slide-image" />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;