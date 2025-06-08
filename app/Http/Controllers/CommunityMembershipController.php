<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityMembershipRequest;
use App\Http\Requests\UpdateCommunityMembershipRequest;
use App\Models\Community;
use App\Models\CommunityMembership;
use Illuminate\Support\Facades\Auth;

class CommunityMembershipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommunityMembershipRequest $request)
    {
        $request->validate([
            'community_id' => 'required|exists:communities,id',
        ]);


        $community = Community::findOrFail($request->community_id);

        if($community->visibilidad === 'publico') {

            CommunityMembership::create([
                'user_id' => Auth::user()->id,
                'community_id' => $community->id,
                'community_role_id' => 3,
            ]);
        }

        // if($community->visibilidad === 'privado'){
        //     // Crear notificacion para el administrador de la comunidad
        // }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(CommunityMembership $communityMembership)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CommunityMembership $communityMembership)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommunityMembershipRequest $request, CommunityMembership $communityMembership)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CommunityMembership $communityMembership)
    {
        //
    }
}
