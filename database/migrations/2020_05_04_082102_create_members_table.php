<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('firstname', 20);
            $table->string('lastname', 20);
            
            $table->string('profile_image', 100);
            $table->boolean('gender');
            $table->date('birthday');
            $table->string('number', 15);
            $table->string('email')->unique();
            $table->string('country', 50);
            $table->string('state', 50);
            $table->string('county', 50);
            $table->string('city', 50);
            $table->string('zip_code', 20);
            $table->string('street', 50);
            $table->string('building', 50)->nullable();
            $table->string('apartment', 50)->nullable();

            $table->date('join_date', 0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('members');
    }
}
