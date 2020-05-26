<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use Illuminate\Support\Facades\Hash;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('username', 50);
            $table->string('password', 100);
            $table->string('email')->unique();
            $table->boolean('admin');
            $table->boolean('active');

            $table->rememberToken();

            $table->timestamps();
        });

        DB::table('users')->insert(
            array(
                'username' => 'admin',
                'password' => Hash::make('123456'),
                'email' => 'admin@gmail.com',
                'admin' => 1,
                'active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
