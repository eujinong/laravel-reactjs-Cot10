<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('category_id');
            $table->integer('creator_id');

            $table->string('name', 50);
            $table->string('url', 100);
            $table->integer('round_days');
            $table->boolean('allow_video');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('gole', 500);
            $table->string('rule', 500);
            $table->string('ending', 500);
            $table->string('note', 1000)->nullable();
            $table->string('status', 10);

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
        Schema::dropIfExists('contests');
    }
}
