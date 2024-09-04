﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FinalYearProject.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.7");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("TEXT");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoleId")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Value")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("SoftwareProject.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("CategoryName")
                        .HasColumnType("TEXT");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("SoftwareProject.Models.Consumer", b =>
                {
                    b.Property<int>("ConsumerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ContactNo")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Dob")
                        .HasColumnType("TEXT");

                    b.Property<string>("FName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("IdentityUserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("LName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("LocationId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ConsumerId");

                    b.HasIndex("IdentityUserId");

                    b.HasIndex("LocationId")
                        .IsUnique();

                    b.ToTable("Consumers");
                });

            modelBuilder.Entity("SoftwareProject.Models.Location", b =>
                {
                    b.Property<int>("LocationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ConsumerId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("FullLocation")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double>("Latitude")
                        .HasColumnType("REAL");

                    b.Property<double>("Longitude")
                        .HasColumnType("REAL");

                    b.HasKey("LocationId");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("SoftwareProject.Models.Newsletter", b =>
                {
                    b.Property<int>("LetterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ConsumerId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("TEXT");

                    b.HasKey("LetterId");

                    b.HasIndex("ConsumerId");

                    b.ToTable("Newsletters");
                });

            modelBuilder.Entity("SoftwareProject.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ConsumerId")
                        .HasColumnType("INTEGER");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("ImageLogo")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Price")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SupermarketName")
                        .HasColumnType("TEXT");

                    b.Property<string>("TempId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("pricePerUnit")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ProductId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("ConsumerId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("SoftwareProject.Models.ProductLocation", b =>
                {
                    b.Property<int?>("ProductId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("LocationId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ProductId", "LocationId");

                    b.HasIndex("LocationId");

                    b.ToTable("ProductLocations");
                });

            modelBuilder.Entity("SoftwareProject.Models.Review", b =>
                {
                    b.Property<int>("ReviewId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ConsumerId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("review")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("reviewDate")
                        .HasColumnType("TEXT");

                    b.Property<int>("stars")
                        .HasColumnType("INTEGER");

                    b.HasKey("ReviewId");

                    b.HasIndex("ConsumerId");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("SoftwareProject.Models.SavedProduct", b =>
                {
                    b.Property<int?>("ConsumerId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ProductId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DateSaved")
                        .HasColumnType("TEXT");

                    b.Property<string>("TempId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ConsumerId", "ProductId");

                    b.HasIndex("ProductId");

                    b.ToTable("SavedProducts");
                });

            modelBuilder.Entity("SoftwareProject.Models.WebScrapper", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsActive")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("TypeName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("WebScrappers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("SoftwareProject.Models.Consumer", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", "IdentityUser")
                        .WithMany()
                        .HasForeignKey("IdentityUserId");

                    b.HasOne("SoftwareProject.Models.Location", "Location")
                        .WithOne("Consumer")
                        .HasForeignKey("SoftwareProject.Models.Consumer", "LocationId");

                    b.Navigation("IdentityUser");

                    b.Navigation("Location");
                });

            modelBuilder.Entity("SoftwareProject.Models.Newsletter", b =>
                {
                    b.HasOne("SoftwareProject.Models.Consumer", "Consumer")
                        .WithMany("Newsletters")
                        .HasForeignKey("ConsumerId");

                    b.Navigation("Consumer");
                });

            modelBuilder.Entity("SoftwareProject.Models.Product", b =>
                {
                    b.HasOne("SoftwareProject.Models.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("SoftwareProject.Models.Consumer", "Consumer")
                        .WithMany("Products")
                        .HasForeignKey("ConsumerId");

                    b.Navigation("Category");

                    b.Navigation("Consumer");
                });

            modelBuilder.Entity("SoftwareProject.Models.ProductLocation", b =>
                {
                    b.HasOne("SoftwareProject.Models.Location", "Location")
                        .WithMany("ProductLocations")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SoftwareProject.Models.Product", "Product")
                        .WithMany("ProductLocations")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Location");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("SoftwareProject.Models.Review", b =>
                {
                    b.HasOne("SoftwareProject.Models.Consumer", "Consumer")
                        .WithMany("Reviews")
                        .HasForeignKey("ConsumerId");

                    b.Navigation("Consumer");
                });

            modelBuilder.Entity("SoftwareProject.Models.SavedProduct", b =>
                {
                    b.HasOne("SoftwareProject.Models.Consumer", "Consumer")
                        .WithMany("SavedProducts")
                        .HasForeignKey("ConsumerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SoftwareProject.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consumer");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("SoftwareProject.Models.Consumer", b =>
                {
                    b.Navigation("Newsletters");

                    b.Navigation("Products");

                    b.Navigation("Reviews");

                    b.Navigation("SavedProducts");
                });

            modelBuilder.Entity("SoftwareProject.Models.Location", b =>
                {
                    b.Navigation("Consumer");

                    b.Navigation("ProductLocations");
                });

            modelBuilder.Entity("SoftwareProject.Models.Product", b =>
                {
                    b.Navigation("ProductLocations");
                });
#pragma warning restore 612, 618
        }
    }
}
