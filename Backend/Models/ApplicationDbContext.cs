
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Models;



    public class ApplicationDbContext:IdentityDbContext<IdentityUser>{

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options){}


        public DbSet<Product> Products{get;set;}
        public DbSet<Consumer> Consumers{get;set;}

         public DbSet<Category> Categories{get;set;}
        public DbSet<Location> Locations{get;set;}
        public DbSet<ProductLocation> ProductLocations{get;set;}

        public DbSet<WebScrapper> WebScrappers{get;set;}

        public DbSet<Newsletter> Newsletters{get;set;}

        public DbSet<SavedProduct> SavedProducts{get;set;}

       

        public DbSet<Review> Reviews{get;set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

          modelBuilder.Entity<Newsletter>()
        .HasOne(n => n.Consumer)
        .WithMany(c => c.Newsletters)
        .HasForeignKey(n => n.ConsumerId);

     modelBuilder.Entity<Consumer>()
        .HasOne(c => c.Location)
        .WithOne(l => l.Consumer)
        .HasForeignKey<Consumer>(c => c.LocationId);

    modelBuilder.Entity<Product>()
        .HasOne(p => p.Category)
        .WithMany()
        .HasForeignKey(p => p.CategoryId);



    modelBuilder.Entity<Product>()
        .HasOne(p => p.Consumer)
        .WithMany(c => c.Products)
        .HasForeignKey(p => p.ConsumerId);

    modelBuilder.Entity<ProductLocation>()
        .HasKey(pl => new { pl.ProductId, pl.LocationId });

    modelBuilder.Entity<ProductLocation>()
        .HasOne(pl => pl.Product)
        .WithMany(p => p.ProductLocations)
        .HasForeignKey(pl => pl.ProductId);

         modelBuilder.Entity<ProductLocation>()
        .HasOne(pl => pl.Location)
        .WithMany(l => l.ProductLocations)
        .HasForeignKey(pl => pl.LocationId);

        
    modelBuilder.Entity<Review>()
        .HasOne(r => r.Consumer)
        .WithMany(c => c.Reviews)
        .HasForeignKey(r => r.ConsumerId);


    modelBuilder.Entity<SavedProduct>()
        .HasKey(sp => new { sp.ConsumerId, sp.ProductId });

    modelBuilder.Entity<SavedProduct>()
        .HasOne(sp => sp.Consumer)
        .WithMany(c => c.SavedProducts)
        .HasForeignKey(sp => sp.ConsumerId);

    modelBuilder.Entity<SavedProduct>()
        .HasOne(sp => sp.Product)
        .WithMany()
        .HasForeignKey(sp => sp.ProductId);


   
            
        }



       


    }






