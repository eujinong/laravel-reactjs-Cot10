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

            $table->string('media1')->nullable();
            $table->string('media2')->nullable();
            $table->string('media3')->nullable();
            $table->string('media4')->nullable();
            $table->string('media5')->nullable();
            $table->string('media6')->nullable();
            $table->string('media7')->nullable();
            $table->string('media8')->nullable();
            $table->string('media9')->nullable();
            $table->string('media10')->nullable();

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
