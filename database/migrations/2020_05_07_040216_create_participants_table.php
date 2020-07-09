<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('member_id');
            $table->integer('contest_id');
            $table->integer('group_code')->nullable();

            $table->integer('round_votes');
            $table->integer('all_votes');

            $table->string('vote_to', 200);

            $table->string('title');
            $table->string('photo_url');
            $table->string('photo_title');
            $table->string('short_desc');
            $table->string('photo_url2')->nullable();
            $table->string('photo_title2')->nullable();
            $table->string('long_desc');
            $table->string('link')->nullable();
            $table->string('link_desc')->nullable();
            $table->string('photo_url3')->nullable();
            $table->string('photo_title3')->nullable();
            $table->string('summary');

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
        Schema::dropIfExists('participants');
    }
}
